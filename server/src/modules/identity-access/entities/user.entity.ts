import type { Email } from './email';
import type { Password } from './password';
import { UserId } from './user-id';

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
