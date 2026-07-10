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

describe('DELETE /api/test/:testId', () => {
	it('returns 401 without authorization', async () => {
		const res = await request(application.app).delete(`/api/test/${randomUUID()}`);

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 401 with invalid access token', async () => {
		const res = await request(application.app).delete(`/api/test/${randomUUID()}`).set('Authorization', 'Bearer invalid-token');

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('unauthorized');
	});

	it('returns 404 for non-existent test', async () => {
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).delete(`/api/test/${randomUUID()}`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('error.test_not_found');
	});

	it('returns 403 when deleting another user test', async () => {
		const createRes = await testUtils.createTest('Test to protect');
		const otherAuthUtils = new AuthUtils(application);

		await otherAuthUtils.register();
		const { accessToken } = await otherAuthUtils.login();

		const res = await request(application.app).delete(`/api/test/${createRes.body.id}`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe('error.test_not_author');

		await otherAuthUtils.deleteUser();
	});

	it('deletes a test', async () => {
		const createRes = await testUtils.createTest('Test to delete');
		const { accessToken } = await authUtils.login();

		const res = await request(application.app).delete(`/api/test/${createRes.body.id}`).set('Authorization', `Bearer ${accessToken}`);

		expect(res.statusCode).toBe(204);
		expect(res.body).toEqual({});
	});

	it('returns 404 when fetching a deleted test', async () => {
		const createRes = await testUtils.createTest('Test to delete and verify');
		const { accessToken } = await authUtils.login();

		const deleteRes = await request(application.app).delete(`/api/test/${createRes.body.id}`).set('Authorization', `Bearer ${accessToken}`);

		expect(deleteRes.statusCode).toBe(204);

		const getRes = await request(application.app).get(`/api/test/${createRes.body.id}`).set('Authorization', `Bearer ${accessToken}`);

		expect(getRes.statusCode).toBe(404);
		expect(getRes.body.message).toBe('error.test_not_found');
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
