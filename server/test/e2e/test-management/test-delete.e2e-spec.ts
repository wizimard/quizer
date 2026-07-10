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

const deleteTest = async (testId: string): Promise<Response> => {
	const { accessToken } = await authUtils.login();

	return request(application.app).delete(`/api/test/${testId}`).set('Authorization', `Bearer ${accessToken}`);
};

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

		const res = await deleteTest(createRes.body.id);

		expect(res.statusCode).toBe(204);
		expect(res.body).toEqual({});
	});

	it('returns 404 when fetching a deleted test', async () => {
		const createRes = await testUtils.createTest('Test to delete and verify');
		const { accessToken } = await authUtils.login();

		const deleteRes = await deleteTest(createRes.body.id);

		expect(deleteRes.statusCode).toBe(204);

		const getRes = await request(application.app).get(`/api/test/${createRes.body.id}`).set('Authorization', `Bearer ${accessToken}`);

		expect(getRes.statusCode).toBe(404);
		expect(getRes.body.message).toBe('error.test_not_found');
	});

	it('does not return deleted test in list', async () => {
		const createRes = await testUtils.createTest('Test to delete from list');
		const { accessToken } = await authUtils.login();

		const deleteRes = await deleteTest(createRes.body.id);

		expect(deleteRes.statusCode).toBe(204);

		const listRes = await request(application.app).get('/api/test').set('Authorization', `Bearer ${accessToken}`);

		expect(listRes.statusCode).toBe(200);
		expect(listRes.body.find((test: { id: string }) => test.id === createRes.body.id)).toBeUndefined();
	});

	it('returns 404 when deleting an already deleted test', async () => {
		const createRes = await testUtils.createTest('Test to delete twice');

		const firstDeleteRes = await deleteTest(createRes.body.id);

		expect(firstDeleteRes.statusCode).toBe(204);

		const secondDeleteRes = await deleteTest(createRes.body.id);

		expect(secondDeleteRes.statusCode).toBe(404);
		expect(secondDeleteRes.body.message).toBe('error.test_not_found');
	});
});

afterAll(async () => {
	await testUtils.deleteTests();
	await authUtils.deleteUser();

	await Bootstrap.stop(application, container);
	resetBoot();
});
