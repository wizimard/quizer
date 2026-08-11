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

type NextQuestionPayload = Partial<{ question_id: string }>;

const nextQuestionPayload = (overrides: NextQuestionPayload = {}): NextQuestionPayload => ({
	question_id: randomUUID(),
	...overrides,
});

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

const nextQuestion = async (testId: string, payload: NextQuestionPayload = {}): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/session/${testId}/next-question`).set('Authorization', `Bearer ${accessToken}`).send(nextQuestionPayload(payload));
};

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;

	authUtils = new AuthUtils(application);

	await authUtils.register();

	testUtils = new TestUtils(application, authUtils);
});

describe('POST /api/session/:testId/next-question', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).post(`/api/session/${randomUUID()}/next-question`).send(nextQuestionPayload());

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app).post(`/api/session/${randomUUID()}/next-question`).set('Authorization', 'Bearer invalid-token').send(nextQuestionPayload());

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 404 for non-existent test', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).post(`/api/session/${randomUUID()}/next-question`).set('Authorization', `Bearer ${accessToken}`).send(nextQuestionPayload());

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 403 when updating another user test', async () => {
		const createRes = await testUtils.createTest('Next question ownership');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app).post(`/api/session/${createRes.body.id}/next-question`).set('Authorization', `Bearer ${accessToken}`).send(nextQuestionPayload());

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe('error.test_not_author');

		await otherAuthUtils.deleteUser();
	});

	it('returns 422 for missing question_id', async () => {
		const createRes = await testUtils.createTest('Next question validation');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).post(`/api/session/${createRes.body.id}/next-question`).set('Authorization', `Bearer ${accessToken}`).send({});

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for empty question_id', async () => {
		const createRes = await testUtils.createTest('Next question empty id');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).post(`/api/session/${createRes.body.id}/next-question`).set('Authorization', `Bearer ${accessToken}`).send({ question_id: '   ' });

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid question_id type', async () => {
		const createRes = await testUtils.createTest('Next question invalid type');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).post(`/api/session/${createRes.body.id}/next-question`).set('Authorization', `Bearer ${accessToken}`).send({ question_id: 123 });

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 400 when test has no active session', async () => {
		const createRes = await testUtils.createTest('Next question closed');
		const questionRes = await createQuestion(createRes.body.id, `Closed session question ${Date.now()}`);

		const res = await nextQuestion(createRes.body.id, { question_id: questionRes.body.id });

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('errors.test_not_opened');
	});

	it('sets current question and returns manual mode execution overview', async () => {
		const createRes = await testUtils.createTest('Next question success');
		const firstQuestionRes = await createQuestion(createRes.body.id, `First question ${Date.now()}`);
		const secondQuestionRes = await createQuestion(createRes.body.id, `Second question ${Date.now()}`);

		const startRes = await startTest(createRes.body.id, 'MANUAL');

		expect(startRes.statusCode).toBe(200);

		const res = await nextQuestion(createRes.body.id, { question_id: firstQuestionRes.body.id });

		expect(res.statusCode).toBe(200);
		expect(res.body).toMatchObject({
			id: createRes.body.id,
			title: 'Next question success',
			run_mode: 'MANUAL',
			registered_users: [],
			questions: [
				{ id: firstQuestionRes.body.id, sort_key: 1000 },
				{ id: secondQuestionRes.body.id, sort_key: 2000 },
			],
			current_question: {
				id: firstQuestionRes.body.id,
				test_id: createRes.body.id,
				sort_key: 1000,
				description: firstQuestionRes.body.description,
			},
			current_question_index: 1,
			total_questions_count: 2,
		});
		expect(res.body.started_from).toEqual(expect.any(String));

		await finishTest(createRes.body.id);
	});

	it('moves current question to the next question', async () => {
		const createRes = await testUtils.createTest('Next question move');
		const firstQuestionRes = await createQuestion(createRes.body.id, `Move first ${Date.now()}`);
		const secondQuestionRes = await createQuestion(createRes.body.id, `Move second ${Date.now()}`);

		await startTest(createRes.body.id, 'MANUAL');

		const firstRes = await nextQuestion(createRes.body.id, { question_id: firstQuestionRes.body.id });
		const secondRes = await nextQuestion(createRes.body.id, { question_id: secondQuestionRes.body.id });

		expect(firstRes.statusCode).toBe(200);
		expect(firstRes.body.current_question.id).toBe(firstQuestionRes.body.id);
		expect(firstRes.body.current_question_index).toBe(1);

		expect(secondRes.statusCode).toBe(200);
		expect(secondRes.body.current_question.id).toBe(secondQuestionRes.body.id);
		expect(secondRes.body.current_question_index).toBe(2);
		expect(secondRes.body.total_questions_count).toBe(2);

		await finishTest(createRes.body.id);
	});

	it('returns 400 when session is finished', async () => {
		const createRes = await testUtils.createTest('Next question finished');
		const questionRes = await createQuestion(createRes.body.id, `Finished session question ${Date.now()}`);

		await startTest(createRes.body.id, 'MANUAL');
		await finishTest(createRes.body.id);

		const res = await nextQuestion(createRes.body.id, { question_id: questionRes.body.id });

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('errors.test_not_opened');
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
