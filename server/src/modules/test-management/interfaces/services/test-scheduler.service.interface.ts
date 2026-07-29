import type { UpdateTestSchedulerInput } from './input/update-test-scheduler.input';
import type { TestSchedulerResultPeriod } from './results/test-scheduler.result';

export interface TestSchedulerService {
	updateSchedulerPeriods(input: UpdateTestSchedulerInput): Promise<Array<TestSchedulerResultPeriod>>;
}
