import type { IQuestionConfigOrderValues, IQuestionConfigOrderValuesAnswer } from '@domain/quiz/question-configs/question-config-order-values';
import type { IAnswerEvaluator } from '../answer-evaluator.interface';

export class OrderValuesAnswerEvaluator implements IAnswerEvaluator {
	readonly type = 'order' as const;

	evaluate(config: unknown, submittedAnswer: unknown): boolean {
		if (!Array.isArray(submittedAnswer)) {
			return false;
		}

		const { answer } = config as IQuestionConfigOrderValues;

		if (answer.length !== submittedAnswer.length) {
			return false;
		}

		return answer.every((expected: IQuestionConfigOrderValuesAnswer, index: number) => {
			const actual = submittedAnswer[index] as IQuestionConfigOrderValuesAnswer | undefined;
			return actual?.optionId === expected.optionId && actual.order === expected.order;
		});
	}
}
