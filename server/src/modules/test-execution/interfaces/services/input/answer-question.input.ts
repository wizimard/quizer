import type { Answer } from '@modules/test-execution/entities/answer';
import type { TestExecutionUserId } from '@modules/test-execution/entities/value-object/test-execution-user-id';
import type { TestId } from '@modules/test-management/entities/value-object/test-id';

export interface AnswerQuestionInput {
	testId: TestId;
	userId: TestExecutionUserId;
	answer: Answer;
}
