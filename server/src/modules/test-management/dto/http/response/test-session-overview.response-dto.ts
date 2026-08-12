import type { TestSessionRunMode } from '@prisma/client';
import type { TestExecutionOverviewQuestionResponse, TestExecutionOverviewRegisteredUserResponse } from './test-execution-overview.response-dto';

export interface TestSessionOverviewRegisteredUserResponse extends TestExecutionOverviewRegisteredUserResponse {
	score: number;
}

export interface TestSessionOverviewResponse {
	id: string;
	title: string;
	run_mode: TestSessionRunMode;
	questions: TestExecutionOverviewQuestionResponse[];
	registered_users: TestSessionOverviewRegisteredUserResponse[];
	max_score: number;
	started_at: Date;
	finished_at: Date;
}
