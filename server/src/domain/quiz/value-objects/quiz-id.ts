export class QuizId {
	private constructor(public readonly value: string) {}

	static of(value: string): QuizId {
		return new QuizId(value);
	}

	equals(other: QuizId): boolean {
		return this.value === other.value;
	}
}
