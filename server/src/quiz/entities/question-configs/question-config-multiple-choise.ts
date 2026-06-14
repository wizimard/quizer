import type { IValidationError } from '../../errors/validation.error';
import { QuestionConfigBase } from './question-config.base';
import { QuestionConfigOption, type IQuestionConfigOption } from './question-config-option';

export interface IQuestionConfigMultipleChoise {
	options: IQuestionConfigOption[];
	answer: string[];
}

export class QuestionConfigMultipleChoise extends QuestionConfigBase implements IQuestionConfigMultipleChoise {
	public readonly type: string = 'multiple_choise';
	options: IQuestionConfigOption[];
	answer: string[];

	constructor(data: IQuestionConfigMultipleChoise) {
		super();

		this.setData(data);
	}

	protected setData({ options, answer }: IQuestionConfigMultipleChoise): void {
		this.options = options.map((option) => new QuestionConfigOption(option.id, option.value));
		this.answer = answer;
	}

	public validate(): IValidationError[] {
		const errors: IValidationError[] = [];

		// проверка на массив, его длинну и отсутсвие невалидных option
		if (!Array.isArray(this.options)) {
			errors.push({
				path: 'config.options',
				message: 'options_wrong_format',
			});
		}

		if (this.options.length < 4 || this.options.length > 8) {
			errors.push({
				path: 'config.options',
				message: 'options_length_invalid',
			});
		}

		for (let i = 0; i < this.options.length; i++) {
			const optionErrors: IValidationError[] = (this.options[i] as IQuestionConfigOption).validate();

			optionErrors.forEach((error) => {
				error.path = `config.options.${i}.` + error.path;
				errors.push(error);
			});
		}

		// проверка на дубли в ответе
		if (new Set(this.answer).size !== this.answer.length) {
			errors.push({
				path: 'config.answer',
				message: 'answer_dublicates',
			});
		}

		// проверка невалидного ответа (отсутсвует вариант)
		for (let i = 0; i < this.answer.length; i++) {
			if (!this.options.find((option: IQuestionConfigOption) => option.id === this.answer[i])) {
				errors.push({
					path: `config.answer.${i}`,
					message: 'answer_not_found',
				});
			}
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
