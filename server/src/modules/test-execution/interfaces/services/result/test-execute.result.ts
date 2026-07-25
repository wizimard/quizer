import type { QuestionEntity, TestStatus } from '@modules/test-management';

export interface TestExecuteResult {
	id: string;
	title: string;
	status: TestStatus;
	openFromAt?: Date;
	openUntilAt?: Date;
	questions: Array<QuestionEntity>;
}
