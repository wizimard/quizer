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

const settingsPayload = (
	title: string,
	overrides: Partial<{
		required_email: boolean;
		required_first_name: boolean;
		required_last_name: boolean;
		show_answers_after_completion: boolean;
	}> = {},
) => ({
	title,
	required_email: false,
	required_first_name: false,
	required_last_name: false,
	show_answers_after_completion: false,
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

describe('PATCH /api/test/:testId/settings', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).patch(`/api/test/${randomUUID()}/settings`).send(settingsPayload('Updated title'));

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app).patch(`/api/test/${randomUUID()}/settings`).set('Authorization', 'Bearer invalid-token').send(settingsPayload('Updated title'));

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 404 for non-existent test', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).patch(`/api/test/${randomUUID()}/settings`).set('Authorization', `Bearer ${accessToken}`).send(settingsPayload('Updated title'));

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 403 when updating another user test settings', async () => {
		const createRes = await testUtils.createTest('Original title');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app).patch(`/api/test/${createRes.body.id}/settings`).set('Authorization', `Bearer ${accessToken}`).send(settingsPayload('Stolen title'));

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe('error.test_not_author');

		await otherAuthUtils.deleteUser();
	});

	it('returns 422 for missing required fields', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).patch(`/api/test/${createRes.body.id}/settings`).set('Authorization', `Bearer ${accessToken}`).send({});

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for invalid title type', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/test/${createRes.body.id}/settings`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				...settingsPayload('Updated title'),
				title: 123,
			});

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('returns 422 for title shorter than 3 characters', async () => {
		const createRes = await testUtils.createTest('Original title');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).patch(`/api/test/${createRes.body.id}/settings`).set('Authorization', `Bearer ${accessToken}`).send(settingsPayload('ab'));

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('validation_failed');
	});

	it('updates test settings', async () => {
		const createRes = await testUtils.createTest('Original title');
		const updatedTitle = `Updated settings ${Date.now()}`;
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/test/${createRes.body.id}/settings`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(
				settingsPayload(updatedTitle, {
					required_email: true,
					required_first_name: true,
					required_last_name: false,
					show_answers_after_completion: true,
				}),
			);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: createRes.body.id,
			author_id: authUtils.userId,
			title: updatedTitle,
			status: createRes.body.status,
			questions: [],
			settings: {
				is_required_email: true,
				is_required_first_name: true,
				is_required_last_name: false,
				is_show_answers_after_completion: true,
			},
			scheduler: {
				periods: [],
			},
			updated_at: expect.any(String),
			created_at: createRes.body.created_at,
		});
		expect(new Date(res.body.updated_at).getTime()).toBeGreaterThanOrEqual(new Date(createRes.body.updated_at).getTime());
	});

	it('trims title before updating test settings', async () => {
		const createRes = await testUtils.createTest('Original title');
		const updatedTitle = `Trimmed settings ${Date.now()}`;
		const { accessToken } = await authUtils.login();

		const res = await request(application.app)
			.patch(`/api/test/${createRes.body.id}/settings`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(settingsPayload(`  ${updatedTitle}  `));

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
