import { UnknownQuestionTypeError } from '../../utils/errors/unknown-question-type.error';
import type { QuestionConfigBase } from './question-config.base';
import { QuestionConfigInputValue } from './question-config-input-value';
import { QuestionConfigMultipleChoise } from './question-config-multiple-choise';
import { QuestionConfigOrderValues } from './question-config-order-values';
import { QuestionConfigSingleChoise } from './question-config-single-choise';
import { QUESTION_TYPES, type QuestionType } from './question-type';

type QuestionConfigConstructor = new (data: unknown) => QuestionConfigBase;

const constructors: Record<QuestionType, QuestionConfigConstructor> = {
	input: QuestionConfigInputValue as QuestionConfigConstructor,
	single_choice: QuestionConfigSingleChoise as QuestionConfigConstructor,
	multiple_choice: QuestionConfigMultipleChoise as QuestionConfigConstructor,
	order: QuestionConfigOrderValues as QuestionConfigConstructor,
};

export function isQuestionType(type: string): type is QuestionType {
	return (QUESTION_TYPES as readonly string[]).includes(type);
}

export function createQuestionConfig(type: QuestionType, data: unknown): QuestionConfigBase {
	const Constructor = constructors[type];
	return new Constructor(data);
}

export function createQuestionConfigFromPayload(config: { type: string } & Record<string, unknown>): QuestionConfigBase {
	if (!isQuestionType(config.type)) {
		throw new UnknownQuestionTypeError(config.type);
	}

	return createQuestionConfig(config.type, config);
}

export { QUESTION_TYPES };
