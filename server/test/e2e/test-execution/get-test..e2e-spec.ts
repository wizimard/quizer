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

const startTest = async (testId: string, payload: Partial<{ duration: number }> = {}): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/test/${testId}/start`).set('Authorization', `Bearer ${accessToken}`).send(payload);
};

const finishTest = async (testId: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).post(`/api/test/${testId}/finish`).set('Authorization', `Bearer ${accessToken}`);
};

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;

	authUtils = new AuthUtils(application);

	await authUtils.register();

	testUtils = new TestUtils(application, authUtils);
});

describe('GET /api/test-execute/:testId', () => {
	it('returns 404 for non-existent test', async () => {
		const res = await request(application.app).get(`/api/test-execute/${randomUUID()}`);

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns a closed test without authentication', async () => {
		const createRes = await testUtils.createTest('Closed execute test');

		const res = await request(application.app).get(`/api/test-execute/${createRes.body.id}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: createRes.body.id,
			title: createRes.body.title,
			status: 'closed',
			questions: [],
		});
		expect(res.body).not.toHaveProperty('open_from_at');
		expect(res.body).not.toHaveProperty('open_until_at');
	});

	it('returns questions without answers', async () => {
		const createRes = await testUtils.createTest('Execute test with questions');
		const questionRes = await createQuestion(createRes.body.id, `What is 2+2? ${Date.now()}`);

		expect(questionRes.statusCode).toBe(201);

		const res = await request(application.app).get(`/api/test-execute/${createRes.body.id}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: createRes.body.id,
			title: createRes.body.title,
			status: 'closed',
			questions: [
				{
					id: questionRes.body.id,
					test_id: createRes.body.id,
					sort_key: questionRes.body.sort_key,
					description: questionRes.body.description,
					config: {
						type: 'input',
						ignore_case: true,
					},
				},
			],
		});
		expect(res.body.questions[0].config).not.toHaveProperty('answer');
	});

	it('returns an open test with open_from_at after start', async () => {
		const createRes = await testUtils.createTest('Open execute test');
		const startRes = await startTest(createRes.body.id);

		expect(startRes.statusCode).toBe(200);

		const res = await request(application.app).get(`/api/test-execute/${createRes.body.id}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: createRes.body.id,
			title: createRes.body.title,
			status: 'open',
			open_from_at: expect.any(String),
			questions: [],
		});
		expect(res.body).not.toHaveProperty('open_until_at');

		await finishTest(createRes.body.id);
	});

	it('returns an open test with open_until_at when started with duration', async () => {
		const createRes = await testUtils.createTest('Timed execute test');
		const startRes = await startTest(createRes.body.id, { duration: 3600 });

		expect(startRes.statusCode).toBe(200);

		const res = await request(application.app).get(`/api/test-execute/${createRes.body.id}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: createRes.body.id,
			title: createRes.body.title,
			status: 'open',
			open_from_at: expect.any(String),
			open_until_at: expect.any(String),
			questions: [],
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
