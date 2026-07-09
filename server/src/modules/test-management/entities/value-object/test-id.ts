export class TestId {
	private constructor(public readonly value: string) {}

	static of(value: string): TestId {
		if (!value.trim()) {
			throw new Error('invalid_test_id');
		}

		return new TestId(value);
	}

	equals(other: TestId): boolean {
		return this.value === other.value;
	}
}
