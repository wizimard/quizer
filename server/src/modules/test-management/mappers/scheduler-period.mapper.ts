import type { TestSchedulerPeriodModel } from '@prisma/client';
import { TestSchedulerPeriod } from '../entities/test-scheduler-period';

export class SchedulerPeriodMapper {
	static toDomain(period: TestSchedulerPeriodModel): TestSchedulerPeriod {
		return new TestSchedulerPeriod(Number(period.id), period.test_id, period.available_from, period.available_to);
	}
}
