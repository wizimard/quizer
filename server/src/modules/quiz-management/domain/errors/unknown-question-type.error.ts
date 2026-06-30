export class UnknownQuestionTypeError extends Error {
	constructor(public readonly type: string) {
		super(`Unknown question type: ${type}`);
		this.name = 'UnknownQuestionTypeError';
	}
}
