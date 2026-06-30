import type { QuestionConfigInputValue } from '@modules/quiz-management/domain/value-objects/question-configs/question-config-input-value';
import type { QuestionConfigBase } from '@modules/quiz-management/domain/value-objects/question-configs/question-config.base';
import type { AnswerEvaluator } from '../answer-evaluator.interface';

export class InputValueAnswerEvaluator implements AnswerEvaluator {
	readonly type = 'input' as const;

	evaluate(config: QuestionConfigBase, submittedAnswer: unknown): boolean {
		if (config.type !== 'input') {
			return false;
		}

		if (typeof submittedAnswer !== 'string') {
			return false;
		}

		const { answer, ignore_case } = config as QuestionConfigInputValue;

		if (ignore_case) {
			return answer.toLowerCase() === submittedAnswer.toLowerCase();
		}

		return answer === submittedAnswer;
	}
}
