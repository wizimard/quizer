import type { IUser } from './user.entity.interface';

export class User implements IUser {
	private _password: string;

	constructor(
		public readonly id: string,
		private _email: string,
	) {}

	get email(): string {
		return this._email;
	}

	get password(): string {
		return this._password;
	}

	public async setPassword(password: string, hasher: (value: string) => Promise<string>): Promise<this> {
		this._password = await hasher(password);

		return this;
	}
}
