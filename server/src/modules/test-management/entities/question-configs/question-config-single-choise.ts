import type { IValidationError } from '../../interfaces/error/validation-object.error.interface';
import { QuestionConfigBase } from './question-config.base';
import { QuestionConfigOption, type IQuestionConfigOption, type IQuestionConfigOptionBase } from './question-config-option';
import { validateQuestionOptions } from './validate-question-options';

export interface IQuestionSingleChoiseConfig {
	options: IQuestionConfigOptionBase[];
	answer: string;
}

export class QuestionConfigSingleChoise extends QuestionConfigBase<IQuestionSingleChoiseConfig> implements IQuestionSingleChoiseConfig {
	public readonly type: string = 'single_choice';
	options: IQuestionConfigOption[] = [];
	answer: string;

	constructor(data: IQuestionSingleChoiseConfig) {
		super();

		this.setData(data);
	}

	protected override setData({ options, answer }: IQuestionSingleChoiseConfig): void {
		this.options = options.map((option) => new QuestionConfigOption(option.id, option.value));
		this.answer = answer;
	}

	public validate(): IValidationError[] {
		const errors: IValidationError[] = validateQuestionOptions(this.options, {
			minLength: 2,
			maxLength: 4,
			lengthMessage: 'options_length_4_invalid',
		});

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
}
