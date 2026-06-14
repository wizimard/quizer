import type { IValidationError } from '../../errors/validation.error';
import { QuestionConfigBase } from './question-config.base';
import { QuestionConfigOption, type IQuestionConfigOption } from './question-config-option';

export interface IQuestionSingleChoiseConfig {
	options: IQuestionConfigOption[];
	answer: string;
}

export class QuestionConfigSingleChoise extends QuestionConfigBase implements IQuestionSingleChoiseConfig {
	public readonly type: string = 'single_choise';
	options: IQuestionConfigOption[] = [];
	answer: string;

	constructor(data: IQuestionSingleChoiseConfig) {
		super();

		this.setData(data);
	}

	protected setData({ options, answer }: IQuestionSingleChoiseConfig): void {
		this.options = options.map((option) => new QuestionConfigOption(option.id, option.value));
		this.answer = answer;
	}

	public validate(): IValidationError[] {
		const errors: IValidationError[] = [];

		if (!Array.isArray(this.options)) {
			errors.push({
				path: 'config.options',
				message: 'options_wrong_format',
			});
		}

		if (this.options.length > 4 || this.options.length < 2) {
			errors.push({
				path: 'config.options',
				message: 'options_length_4_invalid',
			});
		}

		for (let i = 0; i < this.options.length; i++) {
			this.options[i]?.validate().forEach((error) => {
				error.path = `config.options.${i}.` + error.path;
				errors.push(error);
			});
		}

		if (!this.answer) {
			errors.push({
				path: 'config.answer',
				message: 'empty_answer',
			});
		}

		if (!this.options.find((option) => option.id === this.answer)) {
			errors.push({
				path: 'config.answer',
				message: 'answer_not_found',
			});
		}

		return errors;
	}

	public toObject(): object {
		return {
			type: this.type,
			options: this.options.map((option) => option.toObject()),
			answer: this.answer,
		};
	}
}
