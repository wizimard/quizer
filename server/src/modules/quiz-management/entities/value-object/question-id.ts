export class QuestionId {
	private constructor(public readonly value: string) {}

	static of(value: string): QuestionId {
		if (!value.trim()) {
			throw new Error('invalid_quiz_id');
		}

		return new QuestionId(value);
	}

	equals(other: QuestionId): boolean {
		return this.value === other.value;
	}
}
