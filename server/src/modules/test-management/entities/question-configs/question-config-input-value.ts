import type { IValidationError } from '../../interfaces/error/validation-object.error.interface';
import { QuestionConfigBase } from './question-config.base';

export interface IQuestionInputValueConfig {
	answer: string;
	ignore_case: boolean;
}

export class QuestionConfigInputValue extends QuestionConfigBase<IQuestionInputValueConfig> implements IQuestionInputValueConfig {
	public readonly type: string = 'input';
	public answer: string;
	public ignore_case: boolean;

	protected override setData({ answer, ignore_case }: IQuestionInputValueConfig): void {
		this.answer = answer;
		this.ignore_case = ignore_case;
	}

	constructor(data: IQuestionInputValueConfig) {
		super();

		this.setData(data);
	}

	public validate(): IValidationError[] {
		const errors: IValidationError[] = [];

		if (!this.answer) {
			errors.push({
				path: 'config.answer',
				message: 'empty_answer',
			});
		}

		return errors;
	}

	public toObject(): object {
		return {
			type: this.type,
			answer: this.answer,
			ignore_case: this.ignore_case,
		};
	}
}
