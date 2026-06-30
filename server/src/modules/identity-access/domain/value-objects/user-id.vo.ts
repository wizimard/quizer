import { randomUUID } from 'crypto';

export class UserId {
	private constructor(public readonly value: string) {}

	static of(value: string): UserId {
		if (!value.trim()) {
			throw new Error('invalid_user_id');
		}

		return new UserId(value);
	}

	static generate(): UserId {
		return new UserId(randomUUID());
	}

	equals(other: UserId): boolean {
		return this.value === other.value;
	}
}
