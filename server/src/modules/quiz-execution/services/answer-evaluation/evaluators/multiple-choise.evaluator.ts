import type { QuestionConfigMultipleChoise } from '@modules/quiz-management/entities/question-configs/question-config-multiple-choise';
import type { QuestionConfigBase } from '@modules/quiz-management/entities/question-configs/question-config.base';
import type { AnswerEvaluator } from '../answer-evaluator.interface';

export class MultipleChoiseAnswerEvaluator implements AnswerEvaluator {
	readonly type = 'multiple_choise' as const;

	evaluate(config: QuestionConfigBase, submittedAnswer: unknown): boolean {
		if (config.type !== 'multiple_choise') {
			return false;
		}

		if (!Array.isArray(submittedAnswer)) {
			return false;
		}

		const { answer } = config as QuestionConfigMultipleChoise;
		const expected = [...answer].sort();
		const actual = [...submittedAnswer].sort();

		return expected.length === actual.length && expected.every((value, index) => value === actual[index]);
	}
}
