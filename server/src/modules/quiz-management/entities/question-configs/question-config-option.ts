import type { IValidationError } from '../../interfaces/error/validation-object.error.interface';

export interface IQuestionConfigOptionBase {
	id: string;
	value: string;
}

export interface IQuestionConfigOption extends IQuestionConfigOptionBase {
	validate(): IValidationError[];
	toObject(): IQuestionConfigOptionBase;
}

export class QuestionConfigOption implements IQuestionConfigOption {
	constructor(
		public id: string,
		public value: string,
	) {}

	validate(): IValidationError[] {
		const errors: IValidationError[] = [];

		if (!this.id) {
			errors.push({
				path: 'id',
				message: 'empty_id',
			});
		}

		if (!this.value) {
			errors.push({
				path: 'value',
				message: 'empty_value',
			});
		}

		return errors;
	}

	toObject(): IQuestionConfigOptionBase {
		return {
			id: this.id,
			value: this.value,
		};
	}
}
