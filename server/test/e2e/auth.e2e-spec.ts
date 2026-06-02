import request from 'supertest';
import { App } from '../../src/app';
import { boot } from '../../src/main';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Auth e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app).post('/api/auth/register').send({
			email: 'user1@mail.ru',
			password: 'password1',
		});

		expect(res.statusCode).toBe(422);
	});
});

afterAll(async () => {
	await application.stop();
});
