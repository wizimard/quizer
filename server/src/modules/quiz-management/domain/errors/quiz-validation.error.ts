import type { IQuestionValidationError } from './question-validation.error';
import type { IValidationError } from './validation.error';

export interface IQuizValidationError {
	id: string;
	errors: IValidationError[];
	questionsErrors: IQuestionValidationError[];
}
