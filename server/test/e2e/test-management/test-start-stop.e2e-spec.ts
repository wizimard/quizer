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

type StartPayload = Partial<{ run_mode: 'MANUAL' | 'FREE'; duration: number }>;

const startPayload = (overrides: StartPayload = {}): StartPayload => ({
	run_mode: 'MANUAL',
	...overrides,
});

const startTest = async (testId: string, payload: StartPayload = {}): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/session/${testId}/start`).set('Authorization', `Bearer ${accessToken}`).send(startPayload(payload));
};

const finishTest = async (testId: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/session/${testId}/finish`).set('Authorization', `Bearer ${accessToken}`);
};

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;

	authUtils = new AuthUtils(application);

	await authUtils.register();

	testUtils = new TestUtils(application, authUtils);
});

describe('POST /api/session/:testId/start', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).post(`/api/session/${randomUUID()}/start`).send(startPayload());

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app).post(`/api/session/${randomUUID()}/start`).set('Authorization', 'Bearer invalid-token').send(startPayload());

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 404 for non-existent test', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).post(`/api/session/${randomUUID()}/start`).set('Authorization', `Bearer ${accessToken}`).send(startPayload());

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 403 when starting another user test', async () => {
		const createRes = await testUtils.createTest('Original title');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app).post(`/api/session/${createRes.body.id}/start`).set('Authorization', `Bearer ${accessToken}`).send(startPayload());

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe('error.test_not_author');

		await otherAuthUtils.deleteUser();
	});

	it('returns 422 for missing run_mode', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).post(`/api/session/${createRes.body.id}/start`).set('Authorization', `Bearer ${accessToken}`).send({});

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid run_mode', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.post(`/api/session/${createRes.body.id}/start`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({ run_mode: 'INVALID' });

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid duration type', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.post(`/api/session/${createRes.body.id}/start`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(startPayload({ duration: 'invalid' as never }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('starts test in MANUAL mode without duration', async () => {
		const createRes = await testUtils.createTest('Start test');

		const res = await startTest(createRes.body.id, { run_mode: 'MANUAL' });

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: 'Test started successfully' });

		await finishTest(createRes.body.id);
	});

	it('starts test in FREE mode without duration', async () => {
		const createRes = await testUtils.createTest('Start test free');

		const res = await startTest(createRes.body.id, { run_mode: 'FREE' });

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: 'Test started successfully' });

		await finishTest(createRes.body.id);
	});

	it('starts test with duration', async () => {
		const createRes = await testUtils.createTest('Start test with duration');

		const res = await startTest(createRes.body.id, { run_mode: 'MANUAL', duration: 3600 });

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: 'Test started successfully' });

		await finishTest(createRes.body.id);
	});

	it('closes test automatically when duration expires', async () => {
		const createRes = await testUtils.createTest('Auto close by duration');

		const startRes = await startTest(createRes.body.id, { run_mode: 'FREE', duration: 2 });

		expect(startRes.statusCode).toBe(200);
		expect(startRes.body).toEqual({ message: 'Test started successfully' });

		await new Promise((resolve) => setTimeout(resolve, 3500));

		const executeRes = await request(application.app).get(`/api/test-execute/${createRes.body.id}`);

		expect(executeRes.statusCode).toBe(200);
		expect(executeRes.body.status).toBe('closed');

		const finishRes = await finishTest(createRes.body.id);

		expect(finishRes.statusCode).toBe(400);
		expect(finishRes.body).toEqual({ message: 'errors.finish_test_closed' });
	}, 10000);

	it('returns 400 when starting an already open test', async () => {
		const createRes = await testUtils.createTest('Start twice');

		const firstStartRes = await startTest(createRes.body.id);

		expect(firstStartRes.statusCode).toBe(200);
		expect(firstStartRes.body).toEqual({ message: 'Test started successfully' });

		const secondStartRes = await startTest(createRes.body.id);

		expect(secondStartRes.statusCode).toBe(400);
		expect(secondStartRes.body.message).toBe('errors.start_test_open');

		await finishTest(createRes.body.id);
	});
});

describe('POST /api/session/:testId/finish', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).post(`/api/session/${randomUUID()}/finish`);

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app).post(`/api/session/${randomUUID()}/finish`).set('Authorization', 'Bearer invalid-token');

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 404 for non-existent test', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).post(`/api/session/${randomUUID()}/finish`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 403 when finishing another user test', async () => {
		const createRes = await testUtils.createTest('Original title');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app).post(`/api/session/${createRes.body.id}/finish`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe('error.test_not_author');

		await otherAuthUtils.deleteUser();
	});

	it('returns not finished when test has no active session', async () => {
		const createRes = await testUtils.createTest('Finish without start');

		const res = await finishTest(createRes.body.id);

		expect(res.statusCode).toBe(400);
		expect(res.body).toEqual({ message: 'errors.finish_test_closed' });
	});

	it('finishes an active test session', async () => {
		const createRes = await testUtils.createTest('Finish active session');

		const startRes = await startTest(createRes.body.id);

		expect(startRes.statusCode).toBe(200);
		expect(startRes.body).toEqual({ message: 'Test started successfully' });

		const finishRes = await finishTest(createRes.body.id);

		expect(finishRes.statusCode).toBe(200);
		expect(finishRes.body).toEqual({
			message: 'Test finished successfully',
			session_id: expect.any(String),
		});
	});

	it('returns not finished when finishing an already finished session', async () => {
		const createRes = await testUtils.createTest('Finish twice');

		await startTest(createRes.body.id);

		const firstFinishRes = await finishTest(createRes.body.id);

		expect(firstFinishRes.statusCode).toBe(200);
		expect(firstFinishRes.body).toEqual({
			message: 'Test finished successfully',
			session_id: expect.any(String),
		});

		const secondFinishRes = await finishTest(createRes.body.id);

		expect(secondFinishRes.statusCode).toBe(400);
		expect(secondFinishRes.body).toEqual({ message: 'errors.finish_test_closed' });
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
