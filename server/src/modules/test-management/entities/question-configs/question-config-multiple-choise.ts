import type { IValidationError } from '../../interfaces/error/validation-object.error.interface';
import { QuestionConfigBase } from './question-config.base';
import { QuestionConfigOption, type IQuestionConfigOption } from './question-config-option';
import { validateQuestionOptions } from './validate-question-options';

export interface IQuestionConfigMultipleChoise {
	options: IQuestionConfigOption[];
	answer: string[];
}

export class QuestionConfigMultipleChoise extends QuestionConfigBase<IQuestionConfigMultipleChoise> implements IQuestionConfigMultipleChoise {
	public readonly type: string = 'multiple_choise';
	options: IQuestionConfigOption[];
	answer: string[];

	constructor(data: IQuestionConfigMultipleChoise) {
		super();

		this.setData(data);
	}

	protected override setData({ options, answer }: IQuestionConfigMultipleChoise): void {
		this.options = options.map((option) => new QuestionConfigOption(option.id, option.value));
		this.answer = answer;
	}

	public validate(): IValidationError[] {
		const errors: IValidationError[] = validateQuestionOptions(this.options, {
			minLength: 4,
			maxLength: 8,
			lengthMessage: 'options_length_invalid',
		});

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
