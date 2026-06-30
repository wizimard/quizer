export class SubmittedAnswer {
	private constructor(public readonly value: unknown) {}

	static of(value: unknown): SubmittedAnswer {
		return new SubmittedAnswer(value);
	}
}
