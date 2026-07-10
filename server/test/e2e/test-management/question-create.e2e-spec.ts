import { randomUUID } from 'node:crypto';
import request from 'supertest';
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

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;

	authUtils = new AuthUtils(application);

	await authUtils.register();

	testUtils = new TestUtils(application, authUtils);
});

describe('POST /api/question/:testId/questions', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).post(`/api/question/${randomUUID()}/questions`).send(questionPayload('What is 2+2?'));

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app).post(`/api/question/${randomUUID()}/questions`).set('Authorization', 'Bearer invalid-token').send(questionPayload('What is 2+2?'));

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 404 for non-existent test', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).post(`/api/question/${randomUUID()}/questions`).set('Authorization', `Bearer ${accessToken}`).send(questionPayload('What is 2+2?'));

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 403 when creating a question for another user test', async () => {
		const createRes = await testUtils.createTest('Original title');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app).post(`/api/question/${createRes.body.id}/questions`).set('Authorization', `Bearer ${accessToken}`).send(questionPayload('Stolen question'));

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe('error.test_not_author');

		await otherAuthUtils.deleteUser();
	});

	it('returns 422 for missing required fields', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).post(`/api/question/${createRes.body.id}/questions`).set('Authorization', `Bearer ${accessToken}`).send({});

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid description type', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.post(`/api/question/${createRes.body.id}/questions`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				...questionPayload('What is 2+2?'),
				description: 123,
			});

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid config type', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.post(`/api/question/${createRes.body.id}/questions`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				...questionPayload('What is 2+2?'),
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
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.post(`/api/question/${createRes.body.id}/questions`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				...questionPayload('What is 2+2?'),
				config: {
					type: 'input',
					answer: '',
					ignore_case: true,
				},
			});

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('creates a question', async () => {
		const createRes = await testUtils.createTest('Original title');
		const description = `What is 2+2? ${Date.now()}`;
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).post(`/api/question/${createRes.body.id}/questions`).set('Authorization', `Bearer ${accessToken}`).send(questionPayload(description));

		expect(res.statusCode).toBe(201);
		expect(res.body).toMatchObject({
			testId: createRes.body.id,
			sortKey: 1000,
			description,
			config: {
				type: 'input',
				answer: '4',
				ignore_case: true,
			},
		});
		expect(res.body.id).toEqual(expect.any(String));
	});

	it('trims description before creating a question', async () => {
		const createRes = await testUtils.createTest('Original title');
		const description = `Trimmed question ${Date.now()}`;
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.post(`/api/question/${createRes.body.id}/questions`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(questionPayload(`  ${description}  `));

		expect(res.statusCode).toBe(201);
		expect(res.body.description).toBe(description);
	});

	it('assigns incrementing sortKey for subsequent questions', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const firstRes = await request(application.app)
			.post(`/api/question/${createRes.body.id}/questions`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(questionPayload(`First question ${Date.now()}`));

		const secondRes = await request(application.app)
			.post(`/api/question/${createRes.body.id}/questions`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(questionPayload(`Second question ${Date.now()}`));

		expect(firstRes.statusCode).toBe(201);
		expect(secondRes.statusCode).toBe(201);
		expect(firstRes.body.sortKey).toBe(1000);
		expect(secondRes.body.sortKey).toBe(2000);
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
