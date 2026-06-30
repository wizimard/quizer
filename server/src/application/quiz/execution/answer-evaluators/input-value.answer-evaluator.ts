import type { IQuestionInputValueConfig } from '@domain/quiz/question-configs/question-config-input-value';
import type { IAnswerEvaluator } from '../answer-evaluator.interface';

export class InputValueAnswerEvaluator implements IAnswerEvaluator {
	readonly type = 'input' as const;

	evaluate(config: unknown, submittedAnswer: unknown): boolean {
		if (typeof submittedAnswer !== 'string') {
			return false;
		}

		const { answer, ignore_case } = config as IQuestionInputValueConfig;

		if (ignore_case) {
			return answer.toLowerCase() === submittedAnswer.toLowerCase();
		}

		return answer === submittedAnswer;
	}
}
