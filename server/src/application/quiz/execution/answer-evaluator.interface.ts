import type { QuestionType } from '@domain/quiz/question-configs/question-type';

export interface IAnswerEvaluator {
	readonly type: QuestionType;
	evaluate(config: unknown, submittedAnswer: unknown): boolean;
}
