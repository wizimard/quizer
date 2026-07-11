import type { IValidationError } from '../../interfaces/error/validation-object.error.interface';

export interface IQuestionConfigBase {
	type: string;
	answer: unknown;
}

export interface IQuestionConfig<TData = unknown> extends IQuestionConfigBase {
	validate(): IValidationError[];

	update(data: TData): this;
}
