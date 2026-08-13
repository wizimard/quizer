import type { GetTestSessionOverviewInput } from './input/get-test-session-overview.input';
import type { TestGetOverviewInput } from './input/test-get-overview.input';
import type { GetTestHistoryInput } from './input/get-test-history.input';
import type { TestExecutionOverviewResult, TestSessionOverviewResult } from './results/test-overview-result';
import type { GetTestsHistoryInput } from './input/get-tests-history.input';
import type { TestLaunchResult } from './results/test-launch.result';

export interface TestOverviewService {
	getTestExecutionOverview(input: TestGetOverviewInput): Promise<TestExecutionOverviewResult>;
	getTestSessionOverview(input: GetTestSessionOverviewInput): Promise<TestSessionOverviewResult>;
	getTestHistory(input: GetTestHistoryInput): Promise<Array<TestLaunchResult>>;
	getTestsHistory(input: GetTestsHistoryInput): Promise<Array<TestLaunchResult>>;
}
