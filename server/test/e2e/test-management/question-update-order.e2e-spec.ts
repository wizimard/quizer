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

const questionPayload = (
	description: string,
	overrides: Partial<{
		config: object;
	}> = {},
): { description: string; config: object } => ({
	description,
	config: {
		type: 'input',
		answer: '4',
		ignore_case: true,
	},
	...overrides,
});

const createQuestion = async (testId: string, description: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/question/${testId}/questions`).set('Authorization', `Bearer ${accessToken}`).send(questionPayload(description));
};

const changeQuestionOrder = async (testId: string, questionId: string, body: { previousQuestionId?: string | null; nextQuestionId?: string | null } = {}): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).patch(`/api/question/${testId}/questions/${questionId}/order`).set('Authorization', `Bearer ${accessToken}`).send(body);
};

const sortedQuestionIds = (questions: { id: string; sortKey: number }[]): string[] => {
	return [...questions].sort((a, b) => a.sortKey - b.sortKey).map((question) => question.id);
};

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;

	authUtils = new AuthUtils(application);

	await authUtils.register();

	testUtils = new TestUtils(application, authUtils);
});

describe('PATCH /api/question/:testId/questions/:questionId/order', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).patch(`/api/question/${randomUUID()}/questions/${randomUUID()}/order`).send({ previousQuestionId: randomUUID() });

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app)
			.patch(`/api/question/${randomUUID()}/questions/${randomUUID()}/order`)
			.set('Authorization', 'Bearer invalid-token')
			.send({ previousQuestionId: randomUUID() });

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 404 for non-existent test', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/question/${randomUUID()}/questions/${randomUUID()}/order`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({ previousQuestionId: randomUUID() });

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 403 when changing question order for another user test', async () => {
		const createRes = await testUtils.createTest('Original title');
		const questionRes = await createQuestion(createRes.body.id, 'Original question');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app)
			.patch(`/api/question/${createRes.body.id}/questions/${questionRes.body.id}/order`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({ previousQuestionId: questionRes.body.id });

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe('error.test_not_author');

		await otherAuthUtils.deleteUser();
	});

	it('returns 404 for non-existent question', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/question/${createRes.body.id}/questions/${randomUUID()}/order`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({ previousQuestionId: randomUUID() });

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('errors.question_not_found');
	});

	it('returns 422 when previous question does not exist', async () => {
		const createRes = await testUtils.createTest('Original title');
		const questionRes = await createQuestion(createRes.body.id, 'Original question');

		const res = await changeQuestionOrder(createRes.body.id, questionRes.body.id, { previousQuestionId: randomUUID() });

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('previous_question_not_found');
	});

	it('returns 422 when next question does not exist', async () => {
		const createRes = await testUtils.createTest('Original title');
		const questionRes = await createQuestion(createRes.body.id, 'Original question');

		const res = await changeQuestionOrder(createRes.body.id, questionRes.body.id, { nextQuestionId: randomUUID() });

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('next_question_not_found');
	});

	it('returns test unchanged when order payload is empty', async () => {
		const createRes = await testUtils.createTest('Original title');
		const firstQuestionRes = await createQuestion(createRes.body.id, `First question ${Date.now()}`);
		const secondQuestionRes = await createQuestion(createRes.body.id, `Second question ${Date.now()}`);

		const res = await changeQuestionOrder(createRes.body.id, secondQuestionRes.body.id, {});

		expect(res.statusCode).toBe(200);
		expect(res.body.id).toBe(createRes.body.id);
		expect(sortedQuestionIds(res.body.questions)).toEqual([firstQuestionRes.body.id, secondQuestionRes.body.id]);
	});

	it('changes question sortKey using nextQuestionId', async () => {
		const createRes = await testUtils.createTest('Original title');
		const firstQuestionRes = await createQuestion(createRes.body.id, `First question ${Date.now()}`);
		await createQuestion(createRes.body.id, `Second question ${Date.now()}`);
		const thirdQuestionRes = await createQuestion(createRes.body.id, `Third question ${Date.now()}`);

		const res = await changeQuestionOrder(createRes.body.id, firstQuestionRes.body.id, {
			nextQuestionId: thirdQuestionRes.body.id,
		});

		expect(res.statusCode).toBe(200);
		expect(res.body.id).toBe(createRes.body.id);

		const movedQuestion = res.body.questions.find((question: { id: string }) => question.id === firstQuestionRes.body.id);

		expect(movedQuestion.sortKey).toBe(0);
		expect(sortedQuestionIds(res.body.questions)).toEqual([
			firstQuestionRes.body.id,
			res.body.questions.find((question: { sortKey: number }) => question.sortKey === 2000)!.id,
			thirdQuestionRes.body.id,
		]);
	});

	it('returns updated test when changing order with previousQuestionId', async () => {
		const createRes = await testUtils.createTest('Original title');
		const firstQuestionRes = await createQuestion(createRes.body.id, `First question ${Date.now()}`);
		const secondQuestionRes = await createQuestion(createRes.body.id, `Second question ${Date.now()}`);
		const thirdQuestionRes = await createQuestion(createRes.body.id, `Third question ${Date.now()}`);

		const res = await changeQuestionOrder(createRes.body.id, thirdQuestionRes.body.id, {
			previousQuestionId: firstQuestionRes.body.id,
		});

		expect(res.statusCode).toBe(200);
		expect(res.body).toMatchObject({
			id: createRes.body.id,
			title: createRes.body.title,
		});
		expect(res.body.questions).toHaveLength(3);
		expect(res.body.questions.map((question: { sortKey: number }) => question.sortKey)).toEqual([1000, 2000, 3000]);
		expect(sortedQuestionIds(res.body.questions)).toEqual([firstQuestionRes.body.id, secondQuestionRes.body.id, thirdQuestionRes.body.id]);
	});

	it('normalizes question sortKeys when gaps get too close', async () => {
		const createRes = await testUtils.createTest('Original title');
		const questions: Response[] = [];

		for (let i = 0; i < 5; i++) {
			questions.push(await createQuestion(createRes.body.id, `Question ${i + 1} ${Date.now()}`));
		}

		const res = await changeQuestionOrder(createRes.body.id, questions[4]!.body.id, {
			previousQuestionId: questions[1]!.body.id,
		});

		expect(res.statusCode).toBe(200);
		expect(res.body.questions.map((question: { sortKey: number }) => question.sortKey)).toEqual([1000, 2000, 3000, 4000, 5000]);
		expect(sortedQuestionIds(res.body.questions)).toEqual(questions.map((question) => question.body.id));
	});

	it('persists updated question sortKey', async () => {
		const createRes = await testUtils.createTest('Original title');
		const firstQuestionRes = await createQuestion(createRes.body.id, `First question ${Date.now()}`);
		await createQuestion(createRes.body.id, `Second question ${Date.now()}`);
		const thirdQuestionRes = await createQuestion(createRes.body.id, `Third question ${Date.now()}`);
		const { accessToken } = await authUtils.login();

		const changeRes = await changeQuestionOrder(createRes.body.id, firstQuestionRes.body.id, {
			nextQuestionId: thirdQuestionRes.body.id,
		});

		expect(changeRes.statusCode).toBe(200);

		const getRes = await request(application.app).get(`/api/test/${createRes.body.id}`).set('Authorization', `Bearer ${accessToken}`);

		expect(getRes.statusCode).toBe(200);
		expect(getRes.body.questions.find((question: { id: string }) => question.id === firstQuestionRes.body.id).sortKey).toBe(0);
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
