import type { Answer } from '@modules/test-execution/entities/answer';

export interface AnswerQuestionInput {
	testId: string;
	userId: string;
	answer: Answer;
}
