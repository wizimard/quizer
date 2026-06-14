import type { IValidationError } from './validation.error';

export interface IQuestionValidationError {
	id: string;
	errors: IValidationError[];
}
