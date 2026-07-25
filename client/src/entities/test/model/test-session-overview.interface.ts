import type { TestExecutionOverviewRegisteredUser } from "./test-execution-overview.interface";
import type { TestSessionOverviewResponse } from "@shared/api/generated";

export interface TestSessionOverview extends Omit<TestSessionOverviewResponse, "started_at" | "finished_at" | "registered_users"> {
	started_at: Date;
	finished_at: Date;
	registered_users: TestExecutionOverviewRegisteredUser[];
}
