export class UserId {
	private constructor(public readonly value: string) {}

	static of(value: string): UserId {
		return new UserId(value);
	}

	equals(other: UserId): boolean {
		return this.value === other.value;
	}
}
