import type { TestId } from '@modules/test-management';

export interface TestSchedulerResultPeriod {
	id: number;
	testId: TestId;
	availableFrom: Date;
	availableTo?: Date | null | undefined;
}

export interface TestSchedulerResult {
	periods: Array<TestSchedulerResultPeriod>;
}
