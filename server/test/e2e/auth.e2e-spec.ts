import request from 'supertest';
import { getBoot, resetBoot } from '../../src/main';
import { Bootstrap } from '../../src/app/bootstrap';

type BootResult = Awaited<ReturnType<typeof getBoot>>;

let application: BootResult['app'];
let container: BootResult['container'];

const uniqueEmail = (): string => `user-${Date.now()}@example.com`;

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;
});

describe('Auth e2e', () => {
	it('returns 422 for invalid registration payload', async () => {
		const res = await request(application.app).post('/api/auth/register').send({
			email: 'user1@mail.ru',
			password: 'password1',
		});

		expect(res.statusCode).toBe(422);
	});

	it('registers a new user', async () => {
		const email = uniqueEmail();

		const res = await request(application.app).post('/api/auth/register').send({
			email,
			password: 'password123',
		});

		expect(res.statusCode).toBe(201);
		expect(res.body.accessToken).toEqual(expect.any(String));
		expect(res.body.user).toEqual({ email });
	});

	it('logs in', async () => {
		const email = uniqueEmail();
		const password = 'password123';

		await request(application.app).post('/api/auth/register').send({ email, password });

		const res = await request(application.app).post('/api/auth/login').send({ email, password });

		expect(res.statusCode).toBe(200);
		expect(res.body.accessToken).toEqual(expect.any(String));
		expect(res.body.user).toEqual({ email });
	});

	it('returns 422 for invalid login credentials', async () => {
		const res = await request(application.app).post('/api/auth/login').send({
			email: 'missing@example.com',
			password: 'password123',
		});

		expect(res.statusCode).toBe(422);
		expect(res.body.message).toBe('wrong email or password');
	});
});

afterAll(async () => {
	await Bootstrap.stop(application, container);
	resetBoot();
});
