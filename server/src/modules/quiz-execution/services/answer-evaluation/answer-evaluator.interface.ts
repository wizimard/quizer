import type { QuestionConfigBase } from '@modules/quiz-management/entities/question-configs/question-config.base';
import type { QuestionType } from '@modules/quiz-management/entities/question-configs/question-type';

export interface AnswerEvaluator {
	readonly type: QuestionType;
	evaluate(config: QuestionConfigBase, submittedAnswer: unknown): boolean;
}
