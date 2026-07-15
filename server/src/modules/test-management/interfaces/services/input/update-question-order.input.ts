import type { QuestionId, TestId } from '@modules/test-management';

export interface ChangeQuestionOrderInput {
	testId: TestId;
	questionId: QuestionId;
	previousQuestionId: string | null;
	nextQuestionId: string | null;
}
