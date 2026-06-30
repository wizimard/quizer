import type { QuestionConfigSingleChoise } from '@modules/quiz-management/domain/value-objects/question-configs/question-config-single-choise';
import type { QuestionConfigBase } from '@modules/quiz-management/domain/value-objects/question-configs/question-config.base';
import type { AnswerEvaluator } from '../answer-evaluator.interface';

export class SingleChoiseAnswerEvaluator implements AnswerEvaluator {
	readonly type = 'single_choise' as const;

	evaluate(config: QuestionConfigBase, submittedAnswer: unknown): boolean {
		if (config.type !== 'single_choise') {
			return false;
		}

		if (typeof submittedAnswer !== 'string') {
			return false;
		}

		const { answer } = config as QuestionConfigSingleChoise;

		return answer === submittedAnswer;
	}
}
