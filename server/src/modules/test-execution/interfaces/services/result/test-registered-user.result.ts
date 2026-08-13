import type { QuestionEntity, TestEntity } from '@modules/test-management';

export interface TestRegisteredUserResult {
	id: string;

	firstName: string;
	lastName: string;

	currentQuestion: QuestionEntity | null;
	currentQuestionIndex: number;

	test: TestEntity;
}
