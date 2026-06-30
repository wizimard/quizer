import type { IQuizValidationError } from './quiz-validation.error';

export class QuizValidationFailedError extends Error {
	constructor(public readonly validationErrors: IQuizValidationError) {
		super('quiz_validation_failed');
		this.name = 'QuizValidationFailedError';
	}
}
