import type { QuestionResponse } from './question.response-dto';
import type { TestSessionRunMode } from '@prisma/client';

export interface TestExecutionOverviewAnswerResponse {
	question_id: string;
	is_correct: boolean;
	skipped: boolean;
}

export interface TestExecutionOverviewRegisteredUserResponse {
	id: string;
	first_name: string;
	last_name: string;

	answers: TestExecutionOverviewAnswerResponse[];

	started_from: Date;
}

export interface TestExecutionOverviewQuestionResponse {
	id: string;
	sort_key: number;
}

export interface TestExecutionOverviewFreeModeResponse {
	id: string;
	title: string;

	run_mode: TestSessionRunMode;

	questions: TestExecutionOverviewQuestionResponse[];
	registered_users: TestExecutionOverviewRegisteredUserResponse[];

	started_from: Date;
	finished_at?: Date;
}

export interface TestExecutionOverviewManualModeResponse extends TestExecutionOverviewFreeModeResponse {
	current_question: QuestionResponse | null;
	current_question_index: number | null;
	total_questions_count: number;
}

export type TestExecutionOverviewResponse = TestExecutionOverviewFreeModeResponse | TestExecutionOverviewManualModeResponse;
