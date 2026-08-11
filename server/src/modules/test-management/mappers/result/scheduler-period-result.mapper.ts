import { TestSchedulerPeriod } from '../../entities/test-scheduler-period';
import type { TestSchedulerResultPeriod } from '../../interfaces/services/results/test-scheduler.result';

export class SchedulerPeriodResultMapper {
	static toResult(schedulerPeriod: TestSchedulerPeriod): TestSchedulerResultPeriod {
		return {
			id: Number(schedulerPeriod.id),
			testId: schedulerPeriod.testId,
			availableFrom: schedulerPeriod.availableFrom,
			availableTo: schedulerPeriod.availableTo,
		};
	}
}
