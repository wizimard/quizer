import type { QuestionId, TestId } from '@modules/test-management';

export interface DeleteQuestionInput {
	id: QuestionId;
	testId: TestId;
}
