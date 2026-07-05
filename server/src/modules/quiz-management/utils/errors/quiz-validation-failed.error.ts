import { HttpValidationError } from '@shared/error';
import type { IQuizValidationError } from '../../interfaces/error/quiz-validation.error.interface';

export class QuizValidationFailedError extends HttpValidationError {
	constructor(
		public readonly validationErrors: IQuizValidationError,
		context: string,
	) {
		super('error.quiz_validation_failed', context, validationErrors);
	}
}
