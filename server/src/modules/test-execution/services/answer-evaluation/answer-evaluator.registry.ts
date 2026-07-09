import { UnknownQuestionTypeError } from '@modules/test-management/utils/errors/unknown-question-type.error';
import type { QuestionType } from '@modules/test-management/entities/question-configs/question-type';
import type { QuestionConfigBase } from '@modules/test-management/entities/question-configs/question-config.base';
import type { AnswerEvaluator } from './answer-evaluator.interface';
import { InputValueAnswerEvaluator } from './evaluators/input-value.evaluator';
import { MultipleChoiseAnswerEvaluator } from './evaluators/multiple-choise.evaluator';
import { OrderValuesAnswerEvaluator } from './evaluators/order-values.evaluator';
import { SingleChoiseAnswerEvaluator } from './evaluators/single-choise.evaluator';

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
