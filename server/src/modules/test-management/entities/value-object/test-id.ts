export class TestId {
	private constructor(public readonly value: string) {}

	static of(value: string): TestId {
		if (!value.trim()) {
			throw new Error('invalid_test_id');
		}

		return new TestId(value);
	}

	static generate(): TestId {
		return new TestId(crypto.randomUUID());
	}

	equals(other: TestId): boolean {
		return this.value === other.value;
	}
}
