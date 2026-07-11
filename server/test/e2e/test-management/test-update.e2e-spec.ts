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

describe('PATCH /api/test/:testId', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).patch(`/api/test/${randomUUID()}`).send({ title: 'Updated title' });

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app).patch(`/api/test/${randomUUID()}`).set('Authorization', 'Bearer invalid-token').send({ title: 'Updated title' });

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 404 for non-existent test', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).patch(`/api/test/${randomUUID()}`).set('Authorization', `Bearer ${accessToken}`).send({ title: 'Updated title' });

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 403 when updating another user test', async () => {
		const createRes = await testUtils.createTest('Original title');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app).patch(`/api/test/${createRes.body.id}`).set('Authorization', `Bearer ${accessToken}`).send({ title: 'Stolen title' });

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe('error.test_not_author');

		await otherAuthUtils.deleteUser();
	});

	it('returns 422 for invalid title type', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).patch(`/api/test/${createRes.body.id}`).set('Authorization', `Bearer ${accessToken}`).send({ title: 123 });

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('updates a test title', async () => {
		const createRes = await testUtils.createTest('Original title');
		const updatedTitle = `Updated test ${Date.now()}`;
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).patch(`/api/test/${createRes.body.id}`).set('Authorization', `Bearer ${accessToken}`).send({ title: updatedTitle });

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: createRes.body.id,
			author_id: authUtils.userId,
			title: updatedTitle,
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
			updated_at: expect.any(String),
			created_at: createRes.body.created_at,
		});
		expect(new Date(res.body.updated_at).getTime()).toBeGreaterThanOrEqual(new Date(createRes.body.updated_at).getTime());
	});

	it('trims title before updating a test', async () => {
		const createRes = await testUtils.createTest('Original title');
		const updatedTitle = `Trimmed update ${Date.now()}`;
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/test/${createRes.body.id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({ title: `  ${updatedTitle}  ` });

		expect(res.statusCode).toBe(200);
		expect(res.body.title).toBe(updatedTitle);
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
