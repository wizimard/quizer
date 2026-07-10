import type { TestEntity } from '@modules/test-management';

export interface ChangeQuestionOrderInput {
	test: TestEntity;
	questionId: string;
	previousQuestionId: string | null;
	nextQuestionId: string | null;
}
