import request from 'supertest';
import { getBoot } from '../../../src/main';

type BootResult = Awaited<ReturnType<typeof getBoot>>;

export class AuthUtils {
	private application: BootResult['app'];

	private _userId: string = '';

	private _email: string;
	private _password: string;

	private _accessToken: string = '';

	public get accessToken(): string {
		return this._accessToken;
	}

	public get userId(): string {
		return this._userId;
	}

	public get email(): string {
		return this._email;
	}

	public get password(): string {
		return this._password;
	}

	constructor(application: BootResult['app']) {
		this.application = application;

		this._email = `user-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
		this._password = '_password123';
	}

	public async register(): Promise<{ accessToken: string; userId: string }> {
		const res = await request(this.application.app).post('/api/auth/register').send({ email: this._email, password: this._password });
		this._accessToken = res.body.accessToken;
		this._userId = res.body.user.id;

		return {
			accessToken: this._accessToken,
			userId: this._userId,
		};
	}

	public async login(): Promise<{ accessToken: string; userId: string }> {
		const res = await request(this.application.app).post('/api/auth/login').send({ email: this._email, password: this._password });

		this._accessToken = res.body.accessToken;

		return {
			accessToken: this._accessToken,
			userId: res.body.userId,
		};
	}

	public async deleteUser(): Promise<void> {
		await this.login();

		await request(this.application.app).delete('/api/user').set('Authorization', `Bearer ${this._accessToken}`);
	}
}
