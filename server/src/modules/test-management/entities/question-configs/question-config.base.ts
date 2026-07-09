import type { IValidationError } from '../../interfaces/error/validation-object.error.interface';

export abstract class QuestionConfigBase<TData = unknown> {
	public abstract type: string;
	public abstract answer: unknown;

	public abstract validate(): IValidationError[];
	public abstract toObject(): object;
	protected abstract setData(data: TData): void;

	public update(data: TData): this {
		this.setData(data);
		return this;
	}
}
