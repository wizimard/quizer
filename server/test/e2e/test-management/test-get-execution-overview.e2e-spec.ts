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

const questionPayload = (description: string): { description: string; config: object } => ({
	description,
	config: {
		type: 'input',
		answer: '4',
		ignore_case: true,
	},
});

const createQuestion = async (testId: string, description: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/question/${testId}/questions`).set('Authorization', `Bearer ${accessToken}`).send(questionPayload(description));
};

const startTest = async (testId: string, runMode: 'MANUAL' | 'FREE' = 'MANUAL'): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/session/${testId}/start`).set('Authorization', `Bearer ${accessToken}`).send({ run_mode: runMode });
};

const finishTest = async (testId: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/session/${testId}/finish`).set('Authorization', `Bearer ${accessToken}`);
};

const nextQuestion = async (testId: string, questionId: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/session/${testId}/next-question`).set('Authorization', `Bearer ${accessToken}`).send({ question_id: questionId });
};

const registerUser = async (testId: string, firstName: string, lastName: string): Promise<Response> => {
	return request(application.app).post(`/api/test-execute/${testId}/register`).send({ first_name: firstName, last_name: lastName });
};

const getExecutionOverview = async (testId: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).get(`/api/session/${testId}/overview`).set('Authorization', `Bearer ${accessToken}`);
};

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;

	authUtils = new AuthUtils(application);

	await authUtils.register();

	testUtils = new TestUtils(application, authUtils);
});

describe('GET /api/session/:testId/overview', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).get(`/api/session/${randomUUID()}/overview`);

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app).get(`/api/session/${randomUUID()}/overview`).set('Authorization', 'Bearer invalid-token');

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 404 for non-existent test', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).get(`/api/session/${randomUUID()}/overview`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 403 when fetching another user test', async () => {
		const createRes = await testUtils.createTest('Overview ownership');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app).get(`/api/session/${createRes.body.id}/overview`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe('error.test_not_author');

		await otherAuthUtils.deleteUser();
	});

	it('returns 400 when test has no active session', async () => {
		const createRes = await testUtils.createTest('Overview closed');

		const res = await getExecutionOverview(createRes.body.id);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('errors.test_not_opened');
	});

	it('returns 400 when session is finished', async () => {
		const createRes = await testUtils.createTest('Overview finished');

		await startTest(createRes.body.id, 'MANUAL');
		await finishTest(createRes.body.id);

		const res = await getExecutionOverview(createRes.body.id);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('errors.test_not_opened');
	});

	it('returns free mode execution overview', async () => {
		const createRes = await testUtils.createTest('Overview free mode');
		const firstQuestionRes = await createQuestion(createRes.body.id, `Free first ${Date.now()}`);
		const secondQuestionRes = await createQuestion(createRes.body.id, `Free second ${Date.now()}`);

		const startRes = await startTest(createRes.body.id, 'FREE');

		expect(startRes.statusCode).toBe(200);

		const registerRes = await registerUser(createRes.body.id, 'Alice', 'Smith');

		expect(registerRes.statusCode).toBe(200);

		const res = await getExecutionOverview(createRes.body.id);

		expect(res.statusCode).toBe(200);
		expect(res.body).toMatchObject({
			id: createRes.body.id,
			title: 'Overview free mode',
			run_mode: 'FREE',
			questions: [
				{ id: firstQuestionRes.body.id, sort_key: 1000 },
				{ id: secondQuestionRes.body.id, sort_key: 2000 },
			],
			registered_users: [
				{
					id: registerRes.body.id,
					first_name: 'Alice',
					last_name: 'Smith',
					answers: [],
					started_from: expect.any(String),
				},
			],
			started_from: expect.any(String),
		});
		expect(res.body).not.toHaveProperty('current_question');
		expect(res.body).not.toHaveProperty('current_question_index');
		expect(res.body).not.toHaveProperty('total_questions_count');

		await finishTest(createRes.body.id);
	});

	it('returns manual mode execution overview without current question', async () => {
		const createRes = await testUtils.createTest('Overview manual empty');
		const questionRes = await createQuestion(createRes.body.id, `Manual empty ${Date.now()}`);

		const startRes = await startTest(createRes.body.id, 'MANUAL');

		expect(startRes.statusCode).toBe(200);

		const res = await getExecutionOverview(createRes.body.id);

		expect(res.statusCode).toBe(200);
		expect(res.body).toMatchObject({
			id: createRes.body.id,
			title: 'Overview manual empty',
			run_mode: 'MANUAL',
			questions: [{ id: questionRes.body.id, sort_key: 1000 }],
			registered_users: [],
			current_question: null,
			current_question_index: null,
			total_questions_count: 1,
			started_from: expect.any(String),
		});

		await finishTest(createRes.body.id);
	});

	it('returns manual mode execution overview with current question', async () => {
		const createRes = await testUtils.createTest('Overview manual current');
		const firstQuestionRes = await createQuestion(createRes.body.id, `Manual first ${Date.now()}`);
		const secondQuestionRes = await createQuestion(createRes.body.id, `Manual second ${Date.now()}`);

		await startTest(createRes.body.id, 'MANUAL');
		await nextQuestion(createRes.body.id, firstQuestionRes.body.id);

		const registerRes = await registerUser(createRes.body.id, 'Bob', 'Johnson');

		expect(registerRes.statusCode).toBe(200);

		const res = await getExecutionOverview(createRes.body.id);

		expect(res.statusCode).toBe(200);
		expect(res.body).toMatchObject({
			id: createRes.body.id,
			title: 'Overview manual current',
			run_mode: 'MANUAL',
			questions: [
				{ id: firstQuestionRes.body.id, sort_key: 1000 },
				{ id: secondQuestionRes.body.id, sort_key: 2000 },
			],
			registered_users: [
				{
					id: registerRes.body.id,
					first_name: 'Bob',
					last_name: 'Johnson',
					answers: [],
					started_from: expect.any(String),
				},
			],
			current_question: {
				id: firstQuestionRes.body.id,
				test_id: createRes.body.id,
				sort_key: 1000,
				description: firstQuestionRes.body.description,
			},
			current_question_index: 1,
			total_questions_count: 2,
			started_from: expect.any(String),
		});

		await finishTest(createRes.body.id);
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
