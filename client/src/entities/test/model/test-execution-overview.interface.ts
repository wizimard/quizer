import type { Question } from "@entities/question";
import type { TestExecutionOverviewRegisteredUserResponse, TestExecutionOverviewResponse } from "@shared/api/generated";

export interface TestExecutionOverviewRegisteredUser extends Omit<TestExecutionOverviewRegisteredUserResponse, "started_from"> {
	started_from: Date;
}

export interface TestExecutionOverview extends Omit<TestExecutionOverviewResponse, "started_from" | "finished_at" | "registered_users" | "current_question"> {
	started_from: Date;
	finished_at?: Date | null;
	registered_users: TestExecutionOverviewRegisteredUser[];
	current_question?: Question | null;
}
