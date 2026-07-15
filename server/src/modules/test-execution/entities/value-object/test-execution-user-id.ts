export class TestExecutionUserId {
	public value: string;

	private constructor(value: string) {
		this.value = value;
	}

	static of(value: string): TestExecutionUserId {
		return new TestExecutionUserId(value);
	}

	static generate(): TestExecutionUserId {
		return TestExecutionUserId.of(crypto.randomUUID());
	}
}
