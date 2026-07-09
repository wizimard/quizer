import type { QuestionConfigBase } from '@modules/test-management/entities/question-configs/question-config.base';
import type { QuestionType } from '@modules/test-management/entities/question-configs/question-type';

export interface AnswerEvaluator {
	readonly type: QuestionType;
	evaluate(config: QuestionConfigBase, submittedAnswer: unknown): boolean;
}
