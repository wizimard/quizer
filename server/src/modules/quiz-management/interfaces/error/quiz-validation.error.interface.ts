import type { IQuestionValidationError } from './question-validation.error.interface';
import type { IValidationError } from './validation-object.error.interface';

export interface IQuizValidationError {
	id: string;
	errors: IValidationError[];
	questionsErrors: IQuestionValidationError[];
}
