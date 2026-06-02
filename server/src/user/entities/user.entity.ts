import { hash } from '@common/hash';
import type { IUser } from './user.entity.interface';

export class User implements IUser {
	private _password: string;

	constructor(private _email: string) {}

	get email(): string {
		return this._email;
	}

	get password(): string {
		return this._password;
	}

	public async setPassword(password: string): Promise<this> {
		this._password = await hash(password);

		return this;
	}
}
