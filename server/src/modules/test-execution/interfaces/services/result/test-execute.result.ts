import type { QuestionEntity, TestId } from '@modules/test-management';
import type { TestStatus } from '@modules/test-management/entities/test.entity';

export interface TestExecuteResult {
	id: TestId;
	title: string;
	status: TestStatus;
	openFromAt?: Date;
	openUntilAt?: Date;
	questions: Array<QuestionEntity>;
}
