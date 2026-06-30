import type { QuestionType } from '@domain/quiz/question-configs/question-type';
import { UnknownQuestionTypeError } from '@domain/quiz/errors/unknown-question-type.error';
import type { IAnswerEvaluator } from './answer-evaluator.interface';
import { InputValueAnswerEvaluator } from './answer-evaluators/input-value.answer-evaluator';
import { MultipleChoiseAnswerEvaluator } from './answer-evaluators/multiple-choise.answer-evaluator';
import { OrderValuesAnswerEvaluator } from './answer-evaluators/order-values.answer-evaluator';
import { SingleChoiseAnswerEvaluator } from './answer-evaluators/single-choise.answer-evaluator';

const evaluators: Record<QuestionType, IAnswerEvaluator> = {
	input: new InputValueAnswerEvaluator(),
	single_choise: new SingleChoiseAnswerEvaluator(),
	multiple_choise: new MultipleChoiseAnswerEvaluator(),
	order: new OrderValuesAnswerEvaluator(),
};

export function evaluateAnswer(type: QuestionType, config: unknown, submittedAnswer: unknown): boolean {
	return evaluators[type].evaluate(config, submittedAnswer);
}

export function getAnswerEvaluator(type: QuestionType): IAnswerEvaluator {
	const evaluator = evaluators[type];

	if (!evaluator) {
		throw new UnknownQuestionTypeError(type);
	}

	return evaluator;
}
