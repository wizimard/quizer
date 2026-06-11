import type { IValidationError } from '../../errors/validation.error';

export abstract class QuestionConfigBase {
	public abstract type: string;
	public abstract answer: unknown;

	public abstract validate(): IValidationError[];
	public abstract toObject(): object;
	protected abstract setData(data: unknown): void;

	public update(data: unknown): this {
		this.setData(data);
		return this;
	}
}
