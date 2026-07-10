// import request from 'supertest';
// import { getBoot, resetBoot } from '../../../src/main';
// import { Bootstrap } from '../../../src/app/bootstrap';

// type BootResult = Awaited<ReturnType<typeof getBoot>>;

// let application: BootResult['app'];
// let container: BootResult['container'];

// const uniqueEmail = (): string => `user-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
// const defaultPassword = 'password123';

// const createAuthenticatedUser = async (): Promise<{ accessToken: string; userId: string }> => {
// 	const email = uniqueEmail();

// 	const registerRes = await request(application.app).post('/api/auth/register').send({ email, password: defaultPassword });

// 	const meRes = await request(application.app).get('/api/user/me').set('Authorization', `Bearer ${registerRes.body.accessToken}`);

// 	return {
// 		accessToken: registerRes.body.accessToken,
// 		userId: meRes.body.id,
// 	};
// };

// beforeAll(async () => {
// 	const bootResult = await getBoot();
// 	application = bootResult.app;
// 	container = bootResult.container;
// });

// describe('POST /api/test', () => {
// 	it('returns 401 without authorization', async () => {
// 		const res = await request(application.app).post('/api/test').send({ title: 'My test' });

// 		expect(res.statusCode).toBe(401);
// 		expect(res.body.message).toBe('unauthorized');
// 	});

// 	it('returns 401 with invalid access token', async () => {
// 		const res = await request(application.app).post('/api/test').set('Authorization', 'Bearer invalid-token').send({ title: 'My test' });

// 		expect(res.statusCode).toBe(401);
// 		expect(res.body.message).toBe('unauthorized');
// 	});

// 	it('returns 422 for missing title', async () => {
// 		const { accessToken } = await createAuthenticatedUser();

// 		const res = await request(application.app).post('/api/test').set('Authorization', `Bearer ${accessToken}`).send({});

// 		expect(res.statusCode).toBe(422);
// 		expect(res.body.message).toBe('validation_failed');
// 	});

// 	it('returns 422 for invalid title type', async () => {
// 		const { accessToken } = await createAuthenticatedUser();

// 		const res = await request(application.app).post('/api/test').set('Authorization', `Bearer ${accessToken}`).send({ title: 123 });

// 		expect(res.statusCode).toBe(422);
// 		expect(res.body.message).toBe('validation_failed');
// 	});

// 	it('returns 422 for empty title', async () => {
// 		const { accessToken } = await createAuthenticatedUser();

// 		const res = await request(application.app).post('/api/test').set('Authorization', `Bearer ${accessToken}`).send({ title: '' });

// 		expect(res.statusCode).toBe(422);
// 		expect(res.body.message).toBe('error.test_validation_failed');
// 		expect(res.body.errors).toEqual(
// 			expect.objectContaining({
// 				errors: expect.arrayContaining([expect.objectContaining({ path: 'title', message: 'empty_title' })]),
// 			}),
// 		);
// 	});

// 	it('returns 422 for whitespace-only title', async () => {
// 		const { accessToken } = await createAuthenticatedUser();

// 		const res = await request(application.app).post('/api/test').set('Authorization', `Bearer ${accessToken}`).send({ title: '   ' });

// 		expect(res.statusCode).toBe(422);
// 		expect(res.body.message).toBe('error.test_validation_failed');
// 	});

// 	it('creates a test', async () => {
// 		const { accessToken, userId } = await createAuthenticatedUser();
// 		const title = `Test ${Date.now()}`;

// 		const res = await request(application.app).post('/api/test').set('Authorization', `Bearer ${accessToken}`).send({ title });

// 		expect(res.statusCode).toBe(201);
// 		expect(res.body).toEqual({
// 			id: expect.any(String),
// 			authorId: userId,
// 			title,
// 			questions: [],
// 			settings: {
// 				isRequiredEmail: false,
// 				isRequiredFirstName: false,
// 				isRequiredLastName: false,
// 				isShowAnswersAfterCompletion: false,
// 			},
// 			updatedAt: expect.any(String),
// 			createdAt: expect.any(String),
// 		});
// 	});

// 	it('trims title before creating a test', async () => {
// 		const { accessToken } = await createAuthenticatedUser();
// 		const title = `Trimmed test ${Date.now()}`;

// 		const res = await request(application.app)
// 			.post('/api/test')
// 			.set('Authorization', `Bearer ${accessToken}`)
// 			.send({ title: `  ${title}  ` });

// 		expect(res.statusCode).toBe(201);
// 		expect(res.body.title).toBe(title);
// 	});
// });

// afterAll(async () => {
// 	await Bootstrap.stop(application, container);
// 	resetBoot();
// });
