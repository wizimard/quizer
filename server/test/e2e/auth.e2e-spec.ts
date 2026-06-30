import request from 'supertest';
import { App } from '../../src/app';
import { getBoot } from '../../src/main';
import { Bootstrap } from '../../src/bootstrap';
import type { Container } from 'inversify';

let application: App;
let container: Container;

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;
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
	await Bootstrap.stop(application, container);
});
