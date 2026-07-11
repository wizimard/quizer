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

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;

	authUtils = new AuthUtils(application);

	await authUtils.register();

	testUtils = new TestUtils(application, authUtils);
});

describe('GET /api/test/:testId', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).get(`/api/test/${randomUUID()}`);

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app).get(`/api/test/${randomUUID()}`).set('Authorization', 'Bearer invalid-token');

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 404 for non-existent test', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).get(`/api/test/${randomUUID()}`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 403 when fetching another user test', async () => {
		const createRes = await testUtils.createTest('Protected test');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app).get(`/api/test/${createRes.body.id}`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe('error.test_not_author');

		await otherAuthUtils.deleteUser();
	});

	it('returns a test by id', async () => {
		const createRes = await testUtils.createTest('Test to fetch');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).get(`/api/test/${createRes.body.id}`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: createRes.body.id,
			author_id: authUtils.userId,
			title: createRes.body.title,
			status: createRes.body.status,
			questions: [],
			settings: {
				is_required_email: false,
				is_required_first_name: true,
				is_required_last_name: true,
				is_show_answers_after_completion: false,
			},
			scheduler: {
				periods: [],
			},
			updated_at: createRes.body.updated_at,
			created_at: createRes.body.created_at,
		});
	});
});

describe('GET /api/test', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).get('/api/test');

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app).get('/api/test').set('Authorization', 'Bearer invalid-token');

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns an empty list when user has no tests', async () => {
		const emptyListAuthUtils = new AuthUtils(application);

		await emptyListAuthUtils.register();
		const { accessToken } = await emptyListAuthUtils.login();

		const res = await request(application.app).get('/api/test').set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual([]);

		await emptyListAuthUtils.deleteUser();
	});

	it('returns tests belonging to the authenticated user', async () => {
		const authUtils = new AuthUtils(application);
		await authUtils.register();
		const testUtils = new TestUtils(application, authUtils);

		const firstTest = await testUtils.createTest('First user test');
		const secondTest = await testUtils.createTest('Second user test');

		const { accessToken } = await authUtils.login();

		const res = await request(application.app).get('/api/test').set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(
			expect.arrayContaining([
				{
					id: firstTest.body.id,
					author_id: authUtils.userId,
					title: firstTest.body.title,
					status: firstTest.body.status,
					updated_at: firstTest.body.updated_at,
					created_at: firstTest.body.created_at,
				},
				{
					id: secondTest.body.id,
					author_id: authUtils.userId,
					title: secondTest.body.title,
					status: secondTest.body.status,
					updated_at: secondTest.body.updated_at,
					created_at: secondTest.body.created_at,
				},
			]),
		);
		expect(res.body.every((test: { author_id: string }) => test.author_id === authUtils.userId)).toBe(true);

		await testUtils.deleteTests();
		await authUtils.deleteUser();
	});

	it('does not return tests belonging to another user', async () => {
		const createRes = await testUtils.createTest('Owner only test');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app).get('/api/test').set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual([]);

		await otherAuthUtils.deleteUser();
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
