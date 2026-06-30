import { UnknownQuestionTypeError } from '@modules/quiz-management/domain/errors/unknown-question-type.error';
import type { QuestionType } from '@modules/quiz-management/domain/value-objects/question-configs/question-type';
import type { QuestionConfigBase } from '@modules/quiz-management/domain/value-objects/question-configs/question-config.base';
import type { AnswerEvaluator } from './answer-evaluator.interface';
import { InputValueAnswerEvaluator } from './answer-evaluators/input-value.evaluator';
import { MultipleChoiseAnswerEvaluator } from './answer-evaluators/multiple-choise.evaluator';
import { OrderValuesAnswerEvaluator } from './answer-evaluators/order-values.evaluator';
import { SingleChoiseAnswerEvaluator } from './answer-evaluators/single-choise.evaluator';

const evaluators: Record<QuestionType, AnswerEvaluator> = {
	input: new InputValueAnswerEvaluator(),
	single_choise: new SingleChoiseAnswerEvaluator(),
	multiple_choise: new MultipleChoiseAnswerEvaluator(),
	order: new OrderValuesAnswerEvaluator(),
};

export function evaluateAnswer(config: QuestionConfigBase, submittedAnswer: unknown): boolean {
	const evaluator = evaluators[config.type as QuestionType];

	if (!evaluator) {
		throw new UnknownQuestionTypeError(config.type);
	}

	return evaluator.evaluate(config, submittedAnswer);
}

export function getAnswerEvaluator(type: QuestionType): AnswerEvaluator {
	const evaluator = evaluators[type];

	if (!evaluator) {
		throw new UnknownQuestionTypeError(type);
	}

	return evaluator;
}
