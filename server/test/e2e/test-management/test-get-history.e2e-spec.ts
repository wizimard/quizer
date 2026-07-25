import { randomUUID } from 'node:crypto';
import request, { type Response } from 'supertest';
import { getBoot, resetBoot } from '../../../src/main';
import { Bootstrap } from '../../../src/app/bootstrap';
import { AuthUtils } from '../common/auth.util';
import { TestUtils } from '../common/test.util';

type BootResult = Awaited<ReturnType<typeof getBoot>>;

let application: BootResult['app'];
let container: BootResult['container'];

let authUtils: AuthUtils;
let testUtils: TestUtils;

const startTest = async (testId: string, runMode: 'MANUAL' | 'FREE' = 'MANUAL'): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/test/${testId}/start`).set('Authorization', `Bearer ${accessToken}`).send({ run_mode: runMode });
};

const finishTest = async (testId: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/test/${testId}/finish`).set('Authorization', `Bearer ${accessToken}`);
};

const registerUser = async (testId: string, firstName: string, lastName: string): Promise<Response> => {
	return request(application.app).post(`/api/test-execute/${testId}/register`).send({ first_name: firstName, last_name: lastName });
};

const getTestHistory = async (testId: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).get(`/api/test/${testId}/history`).set('Authorization', `Bearer ${accessToken}`);
};

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;

	authUtils = new AuthUtils(application);

	await authUtils.register();

	testUtils = new TestUtils(application, authUtils);
});

describe('GET /api/test/:testId/history', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).get(`/api/test/${randomUUID()}/history`);

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app).get(`/api/test/${randomUUID()}/history`).set('Authorization', 'Bearer invalid-token');

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 404 for non-existent test', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).get(`/api/test/${randomUUID()}/history`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 403 when fetching another user test', async () => {
		const createRes = await testUtils.createTest('History ownership');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app).get(`/api/test/${createRes.body.id}/history`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe('error.test_not_author');

		await otherAuthUtils.deleteUser();
	});

	it('returns empty array when test has no finished sessions', async () => {
		const createRes = await testUtils.createTest('History empty');

		const res = await getTestHistory(createRes.body.id);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual([]);
	});

	it('does not include active unfinished sessions', async () => {
		const createRes = await testUtils.createTest('History active only');

		const startRes = await startTest(createRes.body.id, 'MANUAL');

		expect(startRes.statusCode).toBe(200);

		const res = await getTestHistory(createRes.body.id);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual([]);

		await finishTest(createRes.body.id);
	});

	it('returns finished launch without registered users', async () => {
		const createRes = await testUtils.createTest('History finished empty');

		await startTest(createRes.body.id, 'MANUAL');
		await finishTest(createRes.body.id);

		const res = await getTestHistory(createRes.body.id);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual([
			{
				test_id: createRes.body.id,
				test_title: 'History finished empty',
				session_id: expect.any(String),
				run_mode: 'MANUAL',
				user_registered_count: 0,
				started_at: expect.any(String),
				finished_at: expect.any(String),
			},
		]);
	});

	it('returns finished launch with registered users count', async () => {
		const createRes = await testUtils.createTest('History with users');

		await startTest(createRes.body.id, 'FREE');

		const firstRegisterRes = await registerUser(createRes.body.id, 'Alice', 'Smith');
		const secondRegisterRes = await registerUser(createRes.body.id, 'Bob', 'Johnson');

		expect(firstRegisterRes.statusCode).toBe(200);
		expect(secondRegisterRes.statusCode).toBe(200);

		await finishTest(createRes.body.id);

		const res = await getTestHistory(createRes.body.id);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual([
			{
				test_id: createRes.body.id,
				test_title: 'History with users',
				session_id: expect.any(String),
				run_mode: 'FREE',
				user_registered_count: 2,
				started_at: expect.any(String),
				finished_at: expect.any(String),
			},
		]);
	});

	it('returns multiple finished launches ordered by started_at desc', async () => {
		const createRes = await testUtils.createTest('History multiple launches');

		await startTest(createRes.body.id, 'MANUAL');
		await finishTest(createRes.body.id);

		await startTest(createRes.body.id, 'FREE');
		await registerUser(createRes.body.id, 'Carol', 'White');
		await finishTest(createRes.body.id);

		const res = await getTestHistory(createRes.body.id);

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveLength(2);
		expect(res.body[0]).toEqual({
			test_id: createRes.body.id,
			test_title: 'History multiple launches',
			session_id: expect.any(String),
			run_mode: 'FREE',
			user_registered_count: 1,
			started_at: expect.any(String),
			finished_at: expect.any(String),
		});
		expect(res.body[1]).toEqual({
			test_id: createRes.body.id,
			test_title: 'History multiple launches',
			session_id: expect.any(String),
			run_mode: 'MANUAL',
			user_registered_count: 0,
			started_at: expect.any(String),
			finished_at: expect.any(String),
		});
		expect(new Date(res.body[0].started_at).getTime()).toBeGreaterThanOrEqual(new Date(res.body[1].started_at).getTime());
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
