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

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;

	authUtils = new AuthUtils(application);

	await authUtils.register();

	testUtils = new TestUtils(application, authUtils);
});

describe('PATCH /api/question/:testId/questions/:questionId', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).patch(`/api/question/${randomUUID()}/questions/${randomUUID()}`).send(questionPayload('Updated question'));

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app)
			.patch(`/api/question/${randomUUID()}/questions/${randomUUID()}`)
			.set('Authorization', 'Bearer invalid-token')
			.send(questionPayload('Updated question'));

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 404 for non-existent test', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/question/${randomUUID()}/questions/${randomUUID()}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(questionPayload('Updated question'));

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 403 when updating a question for another user test', async () => {
		const createRes = await testUtils.createTest('Original title');
		const questionRes = await createQuestion(createRes.body.id, 'Original question');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app)
			.patch(`/api/question/${createRes.body.id}/questions/${questionRes.body.id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(questionPayload('Stolen update'));

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe('error.test_not_author');

		await otherAuthUtils.deleteUser();
	});

	it('returns 404 for non-existent question', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/question/${createRes.body.id}/questions/${randomUUID()}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(questionPayload('Updated question'));

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('errors.question_not_found');
	});

	it('returns 422 for missing required fields', async () => {
		const createRes = await testUtils.createTest('Original title');
		const questionRes = await createQuestion(createRes.body.id, 'Original question');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).patch(`/api/question/${createRes.body.id}/questions/${questionRes.body.id}`).set('Authorization', `Bearer ${accessToken}`).send({});

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid description type', async () => {
		const createRes = await testUtils.createTest('Original title');
		const questionRes = await createQuestion(createRes.body.id, 'Original question');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/question/${createRes.body.id}/questions/${questionRes.body.id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				...questionPayload('Updated question'),
				description: 123,
			});

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid config type', async () => {
		const createRes = await testUtils.createTest('Original title');
		const questionRes = await createQuestion(createRes.body.id, 'Original question');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/question/${createRes.body.id}/questions/${questionRes.body.id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				...questionPayload('Updated question'),
				config: {
					type: 'unknown_type',
					answer: '4',
					ignore_case: true,
				},
			});

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid question config', async () => {
		const createRes = await testUtils.createTest('Original title');
		const questionRes = await createQuestion(createRes.body.id, 'Original question');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/question/${createRes.body.id}/questions/${questionRes.body.id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				...questionPayload('Updated question'),
				config: {
					type: 'input',
					answer: '',
					ignore_case: true,
				},
			});

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('updates a question', async () => {
		const createRes = await testUtils.createTest('Original title');
		const questionRes = await createQuestion(createRes.body.id, 'Original question');
		const updatedDescription = `Updated question ${Date.now()}`;
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/question/${createRes.body.id}/questions/${questionRes.body.id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				description: updatedDescription,
				config: {
					type: 'input',
					answer: '8',
					ignore_case: false,
				},
			});

		expect(res.statusCode).toBe(200);
		expect(res.body).toMatchObject({
			id: questionRes.body.id,
			test_id: createRes.body.id,
			sort_key: questionRes.body.sort_key,
			description: updatedDescription,
			config: {
				type: 'input',
				answer: '8',
				ignore_case: false,
			},
		});
	});

	it('trims description before updating a question', async () => {
		const createRes = await testUtils.createTest('Original title');
		const questionRes = await createQuestion(createRes.body.id, 'Original question');
		const updatedDescription = `Trimmed update ${Date.now()}`;
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/question/${createRes.body.id}/questions/${questionRes.body.id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(questionPayload(`  ${updatedDescription}  `));

		expect(res.statusCode).toBe(200);
		expect(res.body.description).toBe(updatedDescription);
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
