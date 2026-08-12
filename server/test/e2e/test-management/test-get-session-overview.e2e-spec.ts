import { randomUUID } from 'node:crypto';
import request, { type Response } from 'supertest';
import { getBoot, resetBoot } from '../../../src/main';
import { Bootstrap } from '../../../src/app/bootstrap';
import { AuthUtils } from '../common/auth.util';
import { TestUtils } from '../common/test.util';
import { QuestionUtils } from '../common/question.util';

type BootResult = Awaited<ReturnType<typeof getBoot>>;

let application: BootResult['app'];
let container: BootResult['container'];

let authUtils: AuthUtils;
let testUtils: TestUtils;
let questionUtils: QuestionUtils;

const startTest = async (testId: string, runMode: 'MANUAL' | 'FREE' = 'MANUAL'): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/session/${testId}/start`).set('Authorization', `Bearer ${accessToken}`).send({ run_mode: runMode });
};

const finishTest = async (testId: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/session/${testId}/finish`).set('Authorization', `Bearer ${accessToken}`);
};

const registerUser = async (testId: string, firstName: string, lastName: string): Promise<Response> => {
	return request(application.app).post(`/api/test-execute/${testId}/register`).send({ first_name: firstName, last_name: lastName });
};

const getTestHistory = async (testId: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).get(`/api/history/${testId}`).set('Authorization', `Bearer ${accessToken}`);
};

const getLatestSessionId = async (testId: string): Promise<string> => {
	const historyRes = await getTestHistory(testId);

	if (historyRes.statusCode !== 200) {
		throw new Error(`Failed to get history for test ${testId}: ${historyRes.statusCode}`);
	}

	const sessionId = historyRes.body[0]?.session_id;

	if (!sessionId) {
		throw new Error(`Session not found in history for test ${testId}`);
	}

	return sessionId;
};

const getSessionOverview = async (testId: string, sessionId: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).get(`/api/history/${testId}/${sessionId}`).set('Authorization', `Bearer ${accessToken}`);
};

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;

	authUtils = new AuthUtils(application);

	await authUtils.register();

	testUtils = new TestUtils(application, authUtils);
	questionUtils = new QuestionUtils(application, authUtils);
});

describe('GET /api/history/:testId/:sessionId', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).get(`/api/history/${randomUUID()}/${randomUUID()}`);

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app).get(`/api/history/${randomUUID()}/${randomUUID()}`).set('Authorization', 'Bearer invalid-token');

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 404 for non-existent test', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).get(`/api/history/${randomUUID()}/${randomUUID()}`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 403 when fetching another user test', async () => {
		const createRes = await testUtils.createTest('Session overview ownership');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app).get(`/api/history/${createRes.body.id}/${randomUUID()}`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe('error.test_not_author');

		await otherAuthUtils.deleteUser();
	});

	it('returns 404 for non-existent session', async () => {
		const createRes = await testUtils.createTest('Session overview missing session');

		const res = await getSessionOverview(createRes.body.id, randomUUID());

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('errors.session_not_found');
	});

	it('returns 404 when session belongs to another test', async () => {
		const firstTestRes = await testUtils.createTest('Session overview first test');
		const secondTestRes = await testUtils.createTest('Session overview second test');

		await startTest(firstTestRes.body.id, 'MANUAL');
		await finishTest(firstTestRes.body.id);

		const sessionId = await getLatestSessionId(firstTestRes.body.id);
		const res = await getSessionOverview(secondTestRes.body.id, sessionId);

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('errors.session_not_found');
	});

	it('returns finished session overview without registered users', async () => {
		const createRes = await testUtils.createTest('Session overview empty');
		const questionRes = await questionUtils.createQuestion(createRes.body.id, `Empty question ${Date.now()}`);

		await startTest(createRes.body.id, 'MANUAL');
		await finishTest(createRes.body.id);

		const sessionId = await getLatestSessionId(createRes.body.id);
		const res = await getSessionOverview(createRes.body.id, sessionId);

		expect(res.statusCode).toBe(200);
		expect(res.body).toMatchObject({
			id: createRes.body.id,
			title: 'Session overview empty',
			run_mode: 'MANUAL',
			questions: [{ id: questionRes.body.id, sort_key: 1000 }],
			registered_users: [],
			max_score: 1,
			started_at: expect.any(String),
			finished_at: expect.any(String),
		});
		expect(new Date(res.body.finished_at).getTime()).toBeGreaterThanOrEqual(new Date(res.body.started_at).getTime());
	});

	it('returns finished session overview with registered users', async () => {
		const createRes = await testUtils.createTest('Session overview with users');
		const firstQuestionRes = await questionUtils.createQuestion(createRes.body.id, `Users first ${Date.now()}`);
		const secondQuestionRes = await questionUtils.createQuestion(createRes.body.id, `Users second ${Date.now()}`);

		await startTest(createRes.body.id, 'FREE');

		const firstRegisterRes = await registerUser(createRes.body.id, 'Alice', 'Smith');
		const secondRegisterRes = await registerUser(createRes.body.id, 'Bob', 'Johnson');

		expect(firstRegisterRes.statusCode).toBe(200);
		expect(secondRegisterRes.statusCode).toBe(200);

		await finishTest(createRes.body.id);

		const sessionId = await getLatestSessionId(createRes.body.id);
		const res = await getSessionOverview(createRes.body.id, sessionId);

		expect(res.statusCode).toBe(200);
		expect(res.body).toMatchObject({
			id: createRes.body.id,
			title: 'Session overview with users',
			run_mode: 'FREE',
			questions: [
				{ id: firstQuestionRes.body.id, sort_key: 1000 },
				{ id: secondQuestionRes.body.id, sort_key: 2000 },
			],
			registered_users: [
				{
					id: firstRegisterRes.body.id,
					first_name: 'Alice',
					last_name: 'Smith',
					answers: [],
					score: 0,
					started_from: expect.any(String),
				},
				{
					id: secondRegisterRes.body.id,
					first_name: 'Bob',
					last_name: 'Johnson',
					answers: [],
					score: 0,
					started_from: expect.any(String),
				},
			],
			max_score: 2,
			started_at: expect.any(String),
			finished_at: expect.any(String),
		});
		expect(res.body.registered_users).toHaveLength(2);
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
