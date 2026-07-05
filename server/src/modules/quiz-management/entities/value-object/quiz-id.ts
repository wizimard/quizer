export class QuizId {
	private constructor(public readonly value: string) {}

	static of(value: string): QuizId {
		if (!value.trim()) {
			throw new Error('invalid_quiz_id');
		}

		return new QuizId(value);
	}

	equals(other: QuizId): boolean {
		return this.value === other.value;
	}
}
