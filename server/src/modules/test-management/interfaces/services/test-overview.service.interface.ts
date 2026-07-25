import type { TestGetOverviewInput } from './input/test-get-overview.input';
import type { TestExecutionOverviewResult } from './results/test-overview-result';

export interface TestOverviewService {
	getTestExecutionOverview(input: TestGetOverviewInput): Promise<TestExecutionOverviewResult>;
}
