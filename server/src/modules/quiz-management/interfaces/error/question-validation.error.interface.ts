import type { IValidationError } from './validation-object.error.interface';

export interface IQuestionValidationError {
	id: string;
	errors: IValidationError[];
}
