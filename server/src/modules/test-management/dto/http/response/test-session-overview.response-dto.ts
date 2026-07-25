import type { TestSessionRunMode } from '@prisma/client';
import type { TestExecutionOverviewQuestionResponse, TestExecutionOverviewRegisteredUserResponse } from './test-execution-overview.response-dto';

export interface TestSessionOverviewResponse {
	id: string;
	title: string;
	run_mode: TestSessionRunMode;
	questions: TestExecutionOverviewQuestionResponse[];
	registered_users: TestExecutionOverviewRegisteredUserResponse[];
	started_at: Date;
	finished_at: Date;
}
