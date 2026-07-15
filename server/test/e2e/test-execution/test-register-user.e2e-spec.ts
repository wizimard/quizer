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
		first_name: string;
		last_name: string;
	}> = {},
): { first_name: string; last_name: string } => ({
	first_name: 'John',
	last_name: 'Doe',
	...overrides,
});

const registerUser = async (testId: string, payload: { first_name: string; last_name: string } = registerPayload()): Promise<Response> => {
	return request(application.app).post(`/api/test-execute/${testId}/register`).send(payload);
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

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;

	authUtils = new AuthUtils(application);

	await authUtils.register();

	testUtils = new TestUtils(application, authUtils);
});

describe('POST /api/test-execute/:testId/register', () => {
	it('returns 422 for missing required fields', async () => {
		const res = await registerUser(randomUUID(), {} as { first_name: string; last_name: string });

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid first_name type', async () => {
		const res = await registerUser(randomUUID(), registerPayload({ first_name: 123 as never }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid last_name type', async () => {
		const res = await registerUser(randomUUID(), registerPayload({ last_name: 123 as never }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for empty first_name', async () => {
		const res = await registerUser(randomUUID(), registerPayload({ first_name: '' }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for empty last_name', async () => {
		const res = await registerUser(randomUUID(), registerPayload({ last_name: '' }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for whitespace-only first_name', async () => {
		const res = await registerUser(randomUUID(), registerPayload({ first_name: '   ' }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for whitespace-only last_name', async () => {
		const res = await registerUser(randomUUID(), registerPayload({ last_name: '   ' }));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 404 for non-existent test', async () => {
		const res = await registerUser(randomUUID(), registerPayload());

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 400 when registering for a closed test', async () => {
		const createRes = await testUtils.createTest('Closed register test');

		const res = await registerUser(createRes.body.id, registerPayload());

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('errors.test_closed');
	});

	it('registers a user for an open test without authentication', async () => {
		const createRes = await testUtils.createTest('Open register test');
		const startRes = await startTest(createRes.body.id);

		expect(startRes.statusCode).toBe(200);

		const res = await registerUser(createRes.body.id, registerPayload({ first_name: 'Alice', last_name: 'Smith' }));

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: expect.any(String),
			first_name: 'Alice',
			last_name: 'Smith',
			current_question: null,
			current_question_index: 0,
			total_questions_count: 0,
		});

		await finishTest(createRes.body.id);
	});

	it('trims first_name and last_name before registering', async () => {
		const createRes = await testUtils.createTest('Trim register test');
		const startRes = await startTest(createRes.body.id);

		expect(startRes.statusCode).toBe(200);

		const res = await registerUser(createRes.body.id, registerPayload({ first_name: '  Bob  ', last_name: '  Johnson  ' }));

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: expect.any(String),
			first_name: 'Bob',
			last_name: 'Johnson',
			current_question: null,
			current_question_index: 0,
			total_questions_count: 0,
		});

		await finishTest(createRes.body.id);
	});

	it('returns the same registered user when registering again with the same name', async () => {
		const createRes = await testUtils.createTest('Idempotent register test');
		const startRes = await startTest(createRes.body.id);

		expect(startRes.statusCode).toBe(200);

		const payload = registerPayload({ first_name: 'Carol', last_name: 'White' });
		const firstRes = await registerUser(createRes.body.id, payload);
		const secondRes = await registerUser(createRes.body.id, payload);

		expect(firstRes.statusCode).toBe(200);
		expect(secondRes.statusCode).toBe(200);
		expect(secondRes.body).toEqual(firstRes.body);

		await finishTest(createRes.body.id);
	});

	it('returns the first question as current_question when the test has questions', async () => {
		const createRes = await testUtils.createTest('Register with questions');
		const questionRes = await createQuestion(createRes.body.id, `What is 2+2? ${Date.now()}`);

		expect(questionRes.statusCode).toBe(201);

		const startRes = await startTest(createRes.body.id);

		expect(startRes.statusCode).toBe(200);

		const res = await registerUser(createRes.body.id, registerPayload({ first_name: 'Dave', last_name: 'Brown' }));

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: expect.any(String),
			first_name: 'Dave',
			last_name: 'Brown',
			current_question: {
				id: questionRes.body.id,
				test_id: createRes.body.id,
				sort_key: questionRes.body.sort_key,
				description: questionRes.body.description,
				config: {
					type: 'input',
					ignore_case: true,
				},
			},
			current_question_index: 0,
			total_questions_count: 1,
		});
		expect(res.body.current_question.config).not.toHaveProperty('answer');

		await finishTest(createRes.body.id);
	});

	it('returns 400 when registering after the test is finished', async () => {
		const createRes = await testUtils.createTest('Finished register test');
		const startRes = await startTest(createRes.body.id);

		expect(startRes.statusCode).toBe(200);

		const finishRes = await finishTest(createRes.body.id);

		expect(finishRes.statusCode).toBe(200);

		const res = await registerUser(createRes.body.id);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('errors.test_closed');
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
