import { QuestionConfigInputValue } from '../entities/question-configs/question-config-input-value';
import { QuestionConfigMultipleChoise } from '../entities/question-configs/question-config-multiple-choise';
import { QuestionConfigOrderValues } from '../entities/question-configs/question-config-order-values';
import { QuestionConfigSingleChoise } from '../entities/question-configs/question-config-single-choise';
import type { IQuestionConfig } from '../entities/question-configs/question-config.interface';

export class QuestionConfigMapper {
	static toPlain(config: IQuestionConfig): object {
		if (config instanceof QuestionConfigInputValue) {
			return {
				type: config.type,
				answer: config.answer,
				ignore_case: config.ignore_case,
			};
		}
		if (config instanceof QuestionConfigMultipleChoise || config instanceof QuestionConfigSingleChoise || config instanceof QuestionConfigOrderValues) {
			return {
				type: config.type,
				answer: config.answer,
				options: config.options.map((option) => ({
					id: option.id,
					value: option.value,
				})),
			};
		}

		throw new Error('Invalid question config type');
	}
}
