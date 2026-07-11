import type { QuestionResponseConfig } from '../dto/http/response/question.response-dto';
import { QuestionConfigInputValue } from '../entities/question-configs/question-config-input-value';
import { QuestionConfigMultipleChoise } from '../entities/question-configs/question-config-multiple-choise';
import { QuestionConfigOrderValues } from '../entities/question-configs/question-config-order-values';
import { QuestionConfigSingleChoise } from '../entities/question-configs/question-config-single-choise';
import type { IQuestionConfig } from '../entities/question-configs/question-config.interface';

export class QuestionConfigMapper {
	static toHttp(config: IQuestionConfig): QuestionResponseConfig {
		if (config instanceof QuestionConfigInputValue) {
			return {
				type: 'input',
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
			} as QuestionResponseConfig;
		}

		throw new Error('Invalid question config type');
	}
}
