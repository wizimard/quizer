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

const deleteQuestion = async (testId: string, questionId: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).delete(`/api/question/${testId}/questions/${questionId}`).set('Authorization', `Bearer ${accessToken}`);
};

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;

	authUtils = new AuthUtils(application);

	await authUtils.register();

	testUtils = new TestUtils(application, authUtils);
});

describe('DELETE /api/question/:testId/questions/:questionId', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).delete(`/api/question/${randomUUID()}/questions/${randomUUID()}`);

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app).delete(`/api/question/${randomUUID()}/questions/${randomUUID()}`).set('Authorization', 'Bearer invalid-token');

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 404 for non-existent test', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).delete(`/api/question/${randomUUID()}/questions/${randomUUID()}`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 403 when deleting a question for another user test', async () => {
		const createRes = await testUtils.createTest('Original title');
		const questionRes = await createQuestion(createRes.body.id, 'Original question');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app).delete(`/api/question/${createRes.body.id}/questions/${questionRes.body.id}`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe('error.test_not_author');

		await otherAuthUtils.deleteUser();
	});

	it('returns 404 for non-existent question', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).delete(`/api/question/${createRes.body.id}/questions/${randomUUID()}`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('errors.question_not_found');
	});

	it('deletes a question', async () => {
		const createRes = await testUtils.createTest('Original title');
		const questionRes = await createQuestion(createRes.body.id, 'Question to delete');

		const res = await deleteQuestion(createRes.body.id, questionRes.body.id);

		expect(res.statusCode).toBe(204);
		expect(res.body).toEqual({});
	});

	it('removes deleted question from test', async () => {
		const createRes = await testUtils.createTest('Original title');
		const questionRes = await createQuestion(createRes.body.id, 'Question to delete and verify');
		const { accessToken } = await authUtils.login();

		const deleteRes = await deleteQuestion(createRes.body.id, questionRes.body.id);

		expect(deleteRes.statusCode).toBe(204);

		const getRes = await request(application.app).get(`/api/test/${createRes.body.id}`).set('Authorization', `Bearer ${accessToken}`);

		expect(getRes.statusCode).toBe(200);
		expect(getRes.body.questions).toEqual([]);
	});

	it('returns 404 when deleting an already deleted question', async () => {
		const createRes = await testUtils.createTest('Original title');
		const questionRes = await createQuestion(createRes.body.id, 'Question to delete twice');

		const firstDeleteRes = await deleteQuestion(createRes.body.id, questionRes.body.id);

		expect(firstDeleteRes.statusCode).toBe(204);

		const secondDeleteRes = await deleteQuestion(createRes.body.id, questionRes.body.id);

		expect(secondDeleteRes.statusCode).toBe(404);
		expect(secondDeleteRes.body.message).toBe('errors.question_not_found');
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
