export class QuestionId {
	private constructor(public readonly value: string) {}

	static of(value: string): QuestionId {
		if (!value.trim()) {
			throw new Error('invalid_question_id');
		}

		return new QuestionId(value);
	}

	static generate(): QuestionId {
		return new QuestionId(crypto.randomUUID());
	}

	equals(other: QuestionId): boolean {
		return this.value === other.value;
	}
}
