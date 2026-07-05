import request, { type Agent } from 'supertest';
import { getBoot, resetBoot } from '../../src/main';
import { Bootstrap } from '../../src/app/bootstrap';

type BootResult = Awaited<ReturnType<typeof getBoot>>;

let application: BootResult['app'];
let container: BootResult['container'];

const uniqueEmail = (): string => `user-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
const defaultPassword = 'password123';

const registerUser = async (email: string = uniqueEmail(), password: string = defaultPassword): Promise<request.Response> => {
	return request(application.app).post('/api/auth/register').send({ email, password });
};

const createAuthenticatedAgent = async (): Promise<{ agent: Agent; email: string; accessToken: string }> => {
	const email = uniqueEmail();
	const agent = request.agent(application.app);

	const registerRes = await agent.post('/api/auth/register').send({ email, password: defaultPassword });

	return {
		agent,
		email,
		accessToken: registerRes.body.accessToken,
	};
};

beforeAll(async () => {
	const bootResult = await getBoot();
	application = bootResult.app;
	container = bootResult.container;
});

describe('Auth e2e', () => {
	describe('POST /api/auth/register', () => {
		it('returns 422 for invalid registration payload', async () => {
			const res = await registerUser(uniqueEmail(), 'short');

			expect(res.statusCode).toBe(422);
			expect(res.body.message).toBe('validation_failed');
		});

		it('returns 422 for invalid email format', async () => {
			const res = await registerUser('not-an-email', defaultPassword);

			expect(res.statusCode).toBe(422);
			expect(res.body.message).toBe('validation_failed');
		});

		it('returns 422 when email is already taken', async () => {
			const email = uniqueEmail();

			await registerUser(email);

			const res = await registerUser(email);

			expect(res.statusCode).toBe(422);
			expect(res.body.message).toBe('email is busy');
		});

		it('registers a new user', async () => {
			const email = uniqueEmail();

			const res = await registerUser(email);

			expect(res.statusCode).toBe(201);
			expect(res.body.accessToken).toEqual(expect.any(String));
			expect(res.body.user).toEqual({ email });
			expect(res.headers['set-cookie']).toEqual(expect.arrayContaining([expect.stringMatching(/^refreshToken=/)]));
		});
	});

	describe('POST /api/auth/login', () => {
		it('returns 422 for invalid login payload', async () => {
			const res = await request(application.app).post('/api/auth/login').send({
				email: uniqueEmail(),
				password: 'short',
			});

			expect(res.statusCode).toBe(422);
			expect(res.body.message).toBe('validation_failed');
		});

		it('returns 422 for invalid login credentials', async () => {
			const res = await request(application.app).post('/api/auth/login').send({
				email: 'missing@example.com',
				password: defaultPassword,
			});

			expect(res.statusCode).toBe(422);
			expect(res.body.message).toBe('wrong email or password');
		});

		it('returns 422 for wrong password', async () => {
			const email = uniqueEmail();

			await registerUser(email);

			const res = await request(application.app).post('/api/auth/login').send({
				email,
				password: 'wrongpassword',
			});

			expect(res.statusCode).toBe(422);
			expect(res.body.message).toBe('wrong email or password');
		});

		it('logs in', async () => {
			const email = uniqueEmail();

			await registerUser(email);

			const res = await request(application.app).post('/api/auth/login').send({ email, password: defaultPassword });

			expect(res.statusCode).toBe(200);
			expect(res.body.accessToken).toEqual(expect.any(String));
			expect(res.body.user).toEqual({ email });
			expect(res.headers['set-cookie']).toEqual(expect.arrayContaining([expect.stringMatching(/^refreshToken=/)]));
		});
	});

	describe('POST /api/auth/refresh', () => {
		it('returns 401 without refresh cookie', async () => {
			const res = await request(application.app).post('/api/auth/refresh');

			expect(res.statusCode).toBe(401);
			expect(res.body.message).toBe('invalid token credentials');
		});

		it('returns 401 for invalid refresh cookie', async () => {
			const res = await request(application.app).post('/api/auth/refresh').set('Cookie', 'refreshToken=invalid-token');

			expect(res.statusCode).toBe(401);
			expect(res.body.message).toBe('invalid token credentials');
		});

		it('refreshes access token using refresh cookie', async () => {
			const { agent } = await createAuthenticatedAgent();

			const res = await agent.post('/api/auth/refresh');

			expect(res.statusCode).toBe(200);
			expect(res.body.accessToken).toEqual(expect.any(String));
			expect(res.headers['set-cookie']).toEqual(expect.arrayContaining([expect.stringMatching(/^refreshToken=/)]));
		});
	});

	describe('POST /api/auth/logout', () => {
		it('returns 401 without authorization', async () => {
			const res = await request(application.app).post('/api/auth/logout');

			expect(res.statusCode).toBe(401);
			expect(res.body.message).toBe('unauthorized');
		});

		it('logs out and invalidates refresh token', async () => {
			const { agent, accessToken } = await createAuthenticatedAgent();

			const logoutRes = await agent.post('/api/auth/logout').set('Authorization', `Bearer ${accessToken}`);

			expect(logoutRes.statusCode).toBe(200);

			const refreshRes = await agent.post('/api/auth/refresh');

			expect(refreshRes.statusCode).toBe(401);
			expect(refreshRes.body.message).toBe('invalid token credentials');
		});
	});

	describe('GET /api/user/me', () => {
		it('returns 401 without authorization', async () => {
			const res = await request(application.app).get('/api/user/me');

			expect(res.statusCode).toBe(401);
			expect(res.body.message).toBe('unauthorized');
		});

		it('returns 401 with invalid access token', async () => {
			const res = await request(application.app).get('/api/user/me').set('Authorization', 'Bearer invalid-token');

			expect(res.statusCode).toBe(401);
			expect(res.body.message).toBe('unauthorized');
		});

		it('returns current user profile', async () => {
			const { email, accessToken } = await createAuthenticatedAgent();

			const res = await request(application.app).get('/api/user/me').set('Authorization', `Bearer ${accessToken}`);

			expect(res.statusCode).toBe(200);
			expect(res.body.email).toBe(email);
			expect(res.body.id).toEqual(expect.any(String));
		});
	});
});

afterAll(async () => {
	await Bootstrap.stop(application, container);
	resetBoot();
});
