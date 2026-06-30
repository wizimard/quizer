import type { IValidationError } from '../errors/validation.error';
import { QuestionConfigBase } from './question-config.base';
import { QuestionConfigOption, type IQuestionConfigOption } from './question-config-option';
import { validateQuestionOptions } from './validate-question-options';

export interface IQuestionConfigOrderValuesAnswer {
	optionId: string;
	order: number;
}

export interface IQuestionConfigOrderValues {
	options: IQuestionConfigOption[];
	answer: IQuestionConfigOrderValuesAnswer[];
}

export class QuestionConfigOrderValues extends QuestionConfigBase<IQuestionConfigOrderValues> implements IQuestionConfigOrderValues {
	public readonly type: string = 'order';
	options: IQuestionConfigOption[];
	answer: IQuestionConfigOrderValuesAnswer[];

	constructor(data: IQuestionConfigOrderValues) {
		super();

		this.setData(data);
	}

	protected override setData({ options, answer }: IQuestionConfigOrderValues): void {
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
			if (!this.options.find((option: IQuestionConfigOption) => option.id === this.answer[i]?.optionId)) {
				errors.push({
					path: `config.answer.${i}`,
					message: 'answer_item_not_found',
				});
			}
		}
		const ordersSum: number = this.answer.reduce((prev: number, curent: IQuestionConfigOrderValuesAnswer) => prev + curent.order, 0);
		const currectSum: number = (this.answer.length * (this.answer.length + 1)) / 2;

		if (ordersSum !== currectSum) {
			errors.push({
				path: 'config.answer',
				message: 'orders_invalid',
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
