import type { IValidationError } from '../../errors/validation.error';
import { QuestionConfigBase } from './question-config.base';
import { QuestionConfigOption, type IQuestionConfigOption } from './question-config-option';

export interface IQuestionConfigOrderValuesAnswer {
	optionId: string;
	order: number;
}

export interface IQuestionConfigOrderValues {
	options: IQuestionConfigOption[];
	answer: IQuestionConfigOrderValuesAnswer[];
}

export class QuestionConfigOrderValues extends QuestionConfigBase implements IQuestionConfigOrderValues {
	public readonly type: string = 'order';
	options: IQuestionConfigOption[];
	answer: IQuestionConfigOrderValuesAnswer[];

	constructor(data: IQuestionConfigOrderValues) {
		super();

		this.setData(data);
	}

	protected setData({ options, answer }: IQuestionConfigOrderValues): void {
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
			answer: this.answer.join('_'),
		};
	}
}
