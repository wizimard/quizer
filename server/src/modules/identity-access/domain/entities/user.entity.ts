import type { Email } from '../value-objects/email.vo';
import type { Password } from '../value-objects/password.vo';
import { UserId } from '../value-objects/user-id.vo';

export interface PasswordHasher {
	hash(plain: string): Promise<string>;
	verify(plain: string, hash: string): Promise<boolean>;
}

export class User {
	private constructor(
		public readonly id: UserId,
		private _email: Email,
		private _passwordHash: string,
	) {}

	get email(): Email {
		return this._email;
	}

	get passwordHash(): string {
		return this._passwordHash;
	}

	static async create(email: Email, password: Password, hasher: PasswordHasher, id?: UserId): Promise<User> {
		const userId = id ?? UserId.generate();
		const passwordHash = await hasher.hash(password.value);

		return new User(userId, email, passwordHash);
	}

	static reconstitute(id: UserId, email: Email, passwordHash: string): User {
		return new User(id, email, passwordHash);
	}

	async verifyPassword(plain: Password, hasher: PasswordHasher): Promise<boolean> {
		return hasher.verify(plain.value, this._passwordHash);
	}

	changeEmail(newEmail: Email): void {
		this._email = newEmail;
	}
}
