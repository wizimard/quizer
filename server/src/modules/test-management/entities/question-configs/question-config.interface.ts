import type { IValidationError } from '../../interfaces/error/validation-object.error.interface';

export interface IQuestionConfigBase {
	type: string;
	answer: unknown;
}

export interface IQuestionConfig<TData = unknown> extends IQuestionConfigBase {
	validate(): IValidationError[];
	toObject(): object;

	update(data: TData): this;
}
