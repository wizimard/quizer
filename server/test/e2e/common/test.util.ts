import request, { type Response } from 'supertest';
import { getBoot } from '../../../src/main';
import { AuthUtils } from './auth.util';

type BootResult = Awaited<ReturnType<typeof getBoot>>;

export class TestUtils {
	private application: BootResult['app'];

	private authUtils: AuthUtils;

	private tests: any[] = [];

	constructor(application: BootResult['app'], authUtils: AuthUtils) {
		this.application = application;
		this.authUtils = authUtils;
	}

	async createTest(title: string = 'test for tests'): Promise<Response> {
		const { accessToken } = await this.authUtils.login();

		const res = await request(this.application.app).post('/api/test').set('Authorization', `Bearer ${accessToken}`).send({ title });

		this.tests.push(res.body);

		return res;
	}

	async deleteTests(): Promise<void> {
		const { accessToken } = await this.authUtils.login();

		for (const test of this.tests) {
			await request(this.application.app).delete(`/api/test/${test.id}`).set('Authorization', `Bearer ${accessToken}`);
		}
	}
}
