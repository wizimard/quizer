import type { QuestionId, TestEntity } from '@modules/test-management';

export interface ChangeQuestionOrderInput {
	test: TestEntity;
	questionId: QuestionId;
	previousQuestionId: string | null;
	nextQuestionId: string | null;
}
