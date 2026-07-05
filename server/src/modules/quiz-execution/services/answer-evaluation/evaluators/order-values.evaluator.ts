import type { IQuestionConfigOrderValuesAnswer, QuestionConfigOrderValues } from '@modules/quiz-management/entities/question-configs/question-config-order-values';
import type { QuestionConfigBase } from '@modules/quiz-management/entities/question-configs/question-config.base';
import type { AnswerEvaluator } from '../answer-evaluator.interface';

export class OrderValuesAnswerEvaluator implements AnswerEvaluator {
	readonly type = 'order' as const;

	evaluate(config: QuestionConfigBase, submittedAnswer: unknown): boolean {
		if (config.type !== 'order') {
			return false;
		}

		if (!Array.isArray(submittedAnswer)) {
			return false;
		}

		const { answer } = config as QuestionConfigOrderValues;

		if (answer.length !== submittedAnswer.length) {
			return false;
		}

		return answer.every((expected: IQuestionConfigOrderValuesAnswer, index: number) => {
			const actual = submittedAnswer[index] as IQuestionConfigOrderValuesAnswer | undefined;

			return actual?.optionId === expected.optionId && actual.order === expected.order;
		});
	}
}
