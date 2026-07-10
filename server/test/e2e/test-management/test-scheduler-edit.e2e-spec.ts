import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { getBoot, resetBoot } from '../../../src/main';
import { Bootstrap } from '../../../src/app/bootstrap';
import { AuthUtils } from '../common/auth.util';
import { TestUtils } from '../common/test.util';

type BootResult = Awaited<ReturnType<typeof getBoot>>;

let application: BootResult['app'];
let container: BootResult['container'];

let authUtils: AuthUtils;
let testUtils: TestUtils;

const futureDate = (daysFromNow: number): string => {
	const date = new Date();

	date.setUTCDate(date.getUTCDate() + daysFromNow);

	return date.toISOString();
};

type SchedulerPeriodsPayload = Partial<{
	add: Array<{ available_from: string; available_to?: string }>;
	update: Array<{ id: number; available_from: string; available_to?: string }>;
	remove: number[];
}>;

const schedulerPeriodsPayload = (overrides: SchedulerPeriodsPayload = {}): SchedulerPeriodsPayload => ({
	...overrides,
});

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;

	authUtils = new AuthUtils(application);

	await authUtils.register();

	testUtils = new TestUtils(application, authUtils);
});

describe('PATCH /api/test/:testId/scheduler/periods', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app)
			.patch(`/api/test/${randomUUID()}/scheduler/periods`)
			.send(schedulerPeriodsPayload({ add: [{ available_from: futureDate(1) }] }));

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app)
			.patch(`/api/test/${randomUUID()}/scheduler/periods`)
			.set('Authorization', 'Bearer invalid-token')
			.send(schedulerPeriodsPayload({ add: [{ available_from: futureDate(1) }] }));

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 404 for non-existent test', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/test/${randomUUID()}/scheduler/periods`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(schedulerPeriodsPayload({ add: [{ available_from: futureDate(1) }] }));

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 403 when updating another user test scheduler periods', async () => {
		const createRes = await testUtils.createTest('Original title');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app)
			.patch(`/api/test/${createRes.body.id}/scheduler/periods`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(schedulerPeriodsPayload({ add: [{ available_from: futureDate(1) }] }));

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe('error.test_not_author');

		await otherAuthUtils.deleteUser();
	});

	it('returns 422 for invalid period date', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/test/${createRes.body.id}/scheduler/periods`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(schedulerPeriodsPayload({ add: [{ available_from: 'not-a-date' }] }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid period id type in update', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/test/${createRes.body.id}/scheduler/periods`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(schedulerPeriodsPayload({ update: [{ id: 'invalid', available_from: futureDate(1) } as never] }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('adds scheduler periods', async () => {
		const createRes = await testUtils.createTest('Scheduler test');
		const { accessToken } = await authUtils.login();
		const availableFrom = futureDate(7);
		const availableTo = futureDate(14);

		const res = await request(application.app)
			.patch(`/api/test/${createRes.body.id}/scheduler/periods`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(schedulerPeriodsPayload({ add: [{ available_from: availableFrom, available_to: availableTo }] }));

		expect(res.statusCode).toBe(200);
		expect(res.body.periods).toHaveLength(1);
		expect(res.body.periods[0]).toMatchObject({
			id: expect.any(Number),
			test_id: createRes.body.id,
			available_from: expect.any(String),
			available_to: expect.any(String),
		});
		expect(new Date(res.body.periods[0].available_from).toISOString()).toBe(new Date(availableFrom).toISOString());
		expect(new Date(res.body.periods[0].available_to).toISOString()).toBe(new Date(availableTo).toISOString());
	});

	it('updates scheduler periods', async () => {
		const createRes = await testUtils.createTest('Scheduler update test');
		const { accessToken } = await authUtils.login();
		const initialFrom = futureDate(10);
		const initialTo = futureDate(20);

		const addRes = await request(application.app)
			.patch(`/api/test/${createRes.body.id}/scheduler/periods`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(schedulerPeriodsPayload({ add: [{ available_from: initialFrom, available_to: initialTo }] }));

		const periodId = addRes.body.periods[0].id;
		const updatedFrom = futureDate(15);
		const updatedTo = futureDate(25);

		const res = await request(application.app)
			.patch(`/api/test/${createRes.body.id}/scheduler/periods`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(schedulerPeriodsPayload({ update: [{ id: periodId, available_from: updatedFrom, available_to: updatedTo }] }));

		expect(res.statusCode).toBe(200);
		expect(res.body.periods).toHaveLength(1);
		expect(res.body.periods[0]).toMatchObject({
			id: periodId,
			test_id: createRes.body.id,
			available_from: expect.any(String),
			available_to: expect.any(String),
		});
		expect(new Date(res.body.periods[0].available_from).toISOString()).toBe(new Date(updatedFrom).toISOString());
		expect(new Date(res.body.periods[0].available_to).toISOString()).toBe(new Date(updatedTo).toISOString());
	});

	it('removes scheduler periods', async () => {
		const createRes = await testUtils.createTest('Scheduler remove test');
		const { accessToken } = await authUtils.login();
		const availableFrom = futureDate(5);
		const availableTo = futureDate(12);

		const addRes = await request(application.app)
			.patch(`/api/test/${createRes.body.id}/scheduler/periods`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(schedulerPeriodsPayload({ add: [{ available_from: availableFrom, available_to: availableTo }] }));

		const periodId = addRes.body.periods[0].id;

		const res = await request(application.app)
			.patch(`/api/test/${createRes.body.id}/scheduler/periods`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(schedulerPeriodsPayload({ remove: [periodId] }));

		expect(res.statusCode).toBe(200);
		expect(res.body.periods).toEqual([]);
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
