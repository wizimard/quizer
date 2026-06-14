import { QuestionConfigInputValue } from './question-config-input-value';
import { QuestionConfigMultipleChoise } from './question-config-multiple-choise';
import { QuestionConfigOrderValues } from './question-config-order-values';
import { QuestionConfigSingleChoise } from './question-config-single-choise';

export const QUESTION_TYPES_CLASSES_MAP: Record<string, any> = {
	input: QuestionConfigInputValue,
	single_choise: QuestionConfigSingleChoise,
	multiple_choise: QuestionConfigMultipleChoise,
	order: QuestionConfigOrderValues,
};
