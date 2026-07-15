export class AnswerId {
	public value: string;

	private constructor(value: string) {
		this.value = value;
	}

	static of(value: string): AnswerId {
		return new AnswerId(value);
	}

	static generate(): AnswerId {
		return new AnswerId(crypto.randomUUID());
	}
}
