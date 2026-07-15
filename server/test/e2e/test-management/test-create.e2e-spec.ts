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

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;

	authUtils = new AuthUtils(application);

	await authUtils.register();

	testUtils = new TestUtils(application, authUtils);
});

describe('POST /api/test', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).post('/api/test').send({ title: 'My test' });

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app).post('/api/test').set('Authorization', 'Bearer invalid-token').send({ title: 'My test' });

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 422 for missing title', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).post('/api/test').set('Authorization', `Bearer ${accessToken}`).send({});

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid title type', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).post('/api/test').set('Authorization', `Bearer ${accessToken}`).send({ title: 123 });

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for empty title', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).post('/api/test').set('Authorization', `Bearer ${accessToken}`).send({ title: '' });

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('error.test_validation_failed');
		expect(res.body.errors).toEqual(
			expect.objectContaining({
				errors: expect.arrayContaining([expect.objectContaining({ path: 'title', message: 'empty_title' })]),
			}),
		);
	});

	it('returns 422 for whitespace-only title', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).post('/api/test').set('Authorization', `Bearer ${accessToken}`).send({ title: '   ' });

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('error.test_validation_failed');
	});

	it('creates a test', async () => {
		const title = `Test ${Date.now()}`;

		const res = await testUtils.createTest(title);

		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({
			id: expect.any(String),
			author_id: authUtils.userId,
			title,
			status: 'closed',
			questions: [],
			settings: {
				is_show_answers_after_completion: false,
			},
			scheduler: {
				periods: [],
			},
			updated_at: expect.any(String),
			created_at: expect.any(String),
		});
	});

	it('trims title before creating a test', async () => {
		const title = `Trimmed test ${Date.now()}`;

		const res = await testUtils.createTest(`  ${title}  `);

		expect(res.statusCode).toBe(201);
		expect(res.body.title).toBe(title);
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
