import type { IQuestionConfigMultipleChoise } from '@domain/quiz/question-configs/question-config-multiple-choise';
import type { IAnswerEvaluator } from '../answer-evaluator.interface';

export class MultipleChoiseAnswerEvaluator implements IAnswerEvaluator {
	readonly type = 'multiple_choise' as const;

	evaluate(config: unknown, submittedAnswer: unknown): boolean {
		if (!Array.isArray(submittedAnswer)) {
			return false;
		}

		const { answer } = config as IQuestionConfigMultipleChoise;
		const expected = [...answer].sort();
		const actual = [...submittedAnswer].sort();

		return expected.length === actual.length && expected.every((value, index) => value === actual[index]);
	}
}
