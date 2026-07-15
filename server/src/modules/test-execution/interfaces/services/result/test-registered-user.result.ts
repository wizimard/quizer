import type { TestExecutionUserId } from '@modules/test-execution/entities/value-object/test-execution-user-id';
import type { QuestionEntity, TestEntity } from '@modules/test-management';

export interface TestRegisteredUserResult {
	id: TestExecutionUserId;

	firstName: string;
	lastName: string;

	currentQuestion: QuestionEntity | null;

	test: TestEntity;
}
