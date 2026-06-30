import type { IQuestionSingleChoiseConfig } from '@domain/quiz/question-configs/question-config-single-choise';
import type { IAnswerEvaluator } from '../answer-evaluator.interface';

export class SingleChoiseAnswerEvaluator implements IAnswerEvaluator {
	readonly type = 'single_choise' as const;

	evaluate(config: unknown, submittedAnswer: unknown): boolean {
		if (typeof submittedAnswer !== 'string') {
			return false;
		}

		const { answer } = config as IQuestionSingleChoiseConfig;
		return answer === submittedAnswer;
	}
}
