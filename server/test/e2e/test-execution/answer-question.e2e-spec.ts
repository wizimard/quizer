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

const registerPayload = (
	overrides: Partial<{
		firstName: string;
		lastName: string;
	}> = {},
): { firstName: string; lastName: string } => ({
	firstName: 'John',
	lastName: 'Doe',
	...overrides,
});

const answerPayload = (
	overrides: Partial<{
		user_id: string;
		answer: string;
		skipped: boolean;
	}> = {},
): { user_id: string; answer: string; skipped?: boolean } => ({
	user_id: randomUUID(),
	answer: '4',
	...overrides,
});

const registerUser = async (testId: string, payload: { firstName: string; lastName: string } = registerPayload()): Promise<Response> => {
	return request(application.app).post(`/api/test-execute/${testId}/register`).send({
		first_name: payload.firstName,
		last_name: payload.lastName,
	});
};

const createQuestion = async (testId: string, description: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app)
		.post(`/api/question/${testId}/questions`)
		.set('Authorization', `Bearer ${accessToken}`)
		.send({
			description,
			config: {
				type: 'input',
				answer: '4',
				ignore_case: true,
			},
		});
};

const startTest = async (testId: string, payload: Partial<{ duration: number }> = {}): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/test/${testId}/start`).set('Authorization', `Bearer ${accessToken}`).send(payload);
};

const finishTest = async (testId: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/test/${testId}/finish`).set('Authorization', `Bearer ${accessToken}`);
};

const answerQuestion = async (testId: string, questionId: string, payload: { user_id: string; answer: string; skipped?: boolean }): Promise<Response> => {
	return request(application.app).post(`/api/test-execute/${testId}/${questionId}/answer`).send(payload);
};

const setupOpenTestWithRegisteredUser = async (
	title: string,
	questionDescriptions: string[],
): Promise<{
	testId: string;
	questions: Array<{ id: string; description: string; sort_key: number }>;
	userId: string;
}> => {
	const createRes = await testUtils.createTest(title);
	const questions: Array<{ id: string; description: string; sort_key: number }> = [];

	for (const description of questionDescriptions) {
		const questionRes = await createQuestion(createRes.body.id, description);

		expect(questionRes.statusCode).toBe(201);

		questions.push({
			id: questionRes.body.id,
			description: questionRes.body.description,
			sort_key: questionRes.body.sort_key,
		});
	}

	const startRes = await startTest(createRes.body.id);

	expect(startRes.statusCode).toBe(200);

	const registerRes = await registerUser(createRes.body.id, registerPayload({ firstName: 'Alice', lastName: 'Smith' }));

	expect(registerRes.statusCode).toBe(200);

	return {
		testId: createRes.body.id,
		questions,
		userId: registerRes.body.id,
	};
};

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;

	authUtils = new AuthUtils(application);

	await authUtils.register();

	testUtils = new TestUtils(application, authUtils);
});

describe('POST /api/test-execute/:testId/:questionId/answer', () => {
	it('returns 422 for missing required fields', async () => {
		const res = await answerQuestion(randomUUID(), randomUUID(), {} as { user_id: string; answer: string });

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for missing user_id', async () => {
		const res = await answerQuestion(randomUUID(), randomUUID(), { answer: '4' } as { user_id: string; answer: string });

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for missing answer', async () => {
		const res = await answerQuestion(randomUUID(), randomUUID(), { user_id: randomUUID() } as { user_id: string; answer: string });

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for empty user_id', async () => {
		const res = await answerQuestion(randomUUID(), randomUUID(), answerPayload({ user_id: '' }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for empty answer', async () => {
		const res = await answerQuestion(randomUUID(), randomUUID(), answerPayload({ answer: '' }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for whitespace-only user_id', async () => {
		const res = await answerQuestion(randomUUID(), randomUUID(), answerPayload({ user_id: '   ' }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for whitespace-only answer', async () => {
		const res = await answerQuestion(randomUUID(), randomUUID(), answerPayload({ answer: '   ' }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid user_id type', async () => {
		const res = await answerQuestion(randomUUID(), randomUUID(), answerPayload({ user_id: 123 as never }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid answer type', async () => {
		const res = await answerQuestion(randomUUID(), randomUUID(), answerPayload({ answer: 123 as never }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid skipped type', async () => {
		const res = await answerQuestion(randomUUID(), randomUUID(), answerPayload({ skipped: 'true' as never }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 404 for non-existent test', async () => {
		const res = await answerQuestion(randomUUID(), randomUUID(), answerPayload());

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 400 when answering on a closed test', async () => {
		const createRes = await testUtils.createTest('Closed answer test');
		const questionRes = await createQuestion(createRes.body.id, `What is 2+2? ${Date.now()}`);

		expect(questionRes.statusCode).toBe(201);

		const res = await answerQuestion(createRes.body.id, questionRes.body.id, answerPayload());

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('errors.test_closed');
	});

	it('returns 404 for non-existent question', async () => {
		const { testId, userId } = await setupOpenTestWithRegisteredUser('Answer missing question test', [`What is 2+2? ${Date.now()}`]);

		const res = await answerQuestion(testId, randomUUID(), answerPayload({ user_id: userId }));

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.question_not_found');

		await finishTest(testId);
	});

	it('returns 404 for question from another test', async () => {
		const firstTest = await setupOpenTestWithRegisteredUser('Answer first test', [`First test question ${Date.now()}`]);
		const secondTest = await setupOpenTestWithRegisteredUser('Answer second test', [`Second test question ${Date.now()}`]);

		const res = await answerQuestion(firstTest.testId, secondTest.questions[0].id, answerPayload({ user_id: firstTest.userId }));

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.question_not_found');

		await finishTest(firstTest.testId);
		await finishTest(secondTest.testId);
	});

	it('returns 404 for non-existent user', async () => {
		const { testId, questions } = await setupOpenTestWithRegisteredUser('Answer missing user test', [`What is 2+2? ${Date.now()}`]);

		const res = await answerQuestion(testId, questions[0].id, answerPayload());

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');

		await finishTest(testId);
	});

	it('returns 400 when answering after the test is finished', async () => {
		const { testId, questions, userId } = await setupOpenTestWithRegisteredUser('Finished answer test', [`What is 2+2? ${Date.now()}`]);

		const finishRes = await finishTest(testId);

		expect(finishRes.statusCode).toBe(200);

		const res = await answerQuestion(testId, questions[0].id, answerPayload({ user_id: userId }));

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('errors.test_closed');
	});

	it('answers a question and returns the next question without authentication', async () => {
		const timestamp = Date.now();
		const { testId, questions, userId } = await setupOpenTestWithRegisteredUser('Answer next question test', [`First question ${timestamp}`, `Second question ${timestamp}`]);

		const res = await answerQuestion(testId, questions[0].id, answerPayload({ user_id: userId, answer: '4' }));

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: userId,
			first_name: 'Alice',
			last_name: 'Smith',
			current_question: {
				id: questions[1].id,
				test_id: testId,
				sort_key: questions[1].sort_key,
				description: questions[1].description,
				config: {
					type: 'input',
					ignore_case: true,
				},
			},
			current_question_index: 1,
			total_questions_count: 2,
		});
		expect(res.body.current_question.config).not.toHaveProperty('answer');

		await finishTest(testId);
	});

	it('returns null current_question after answering the last question', async () => {
		const { testId, questions, userId } = await setupOpenTestWithRegisteredUser('Answer last question test', [`Only question ${Date.now()}`]);

		const res = await answerQuestion(testId, questions[0].id, answerPayload({ user_id: userId, answer: '4' }));

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: userId,
			first_name: 'Alice',
			last_name: 'Smith',
			current_question: null,
			current_question_index: 0,
			total_questions_count: 1,
		});

		await finishTest(testId);
	});

	it('accepts a skipped answer', async () => {
		const { testId, questions, userId } = await setupOpenTestWithRegisteredUser('Skipped answer test', [`Skippable question ${Date.now()}`]);

		const res = await answerQuestion(testId, questions[0].id, answerPayload({ user_id: userId, answer: 'skipped', skipped: true }));

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: userId,
			first_name: 'Alice',
			last_name: 'Smith',
			current_question: null,
			current_question_index: 0,
			total_questions_count: 1,
		});

		await finishTest(testId);
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
