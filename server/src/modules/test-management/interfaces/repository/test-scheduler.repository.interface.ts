import type { TestSchedulerPeriod } from '@modules/test-management/entities/test-scheduler-period';
import type { TestSchedulerPeriodModel } from '@prisma/client';

export interface TestUpdateSchedulerPeriodsData {
	add?: Array<TestSchedulerPeriod>;
	update?: Array<TestSchedulerPeriod>;
	remove?: Array<number>;
}

export interface TestSchedulerRepository {
	getScheduler(testId: string): Promise<Array<TestSchedulerPeriodModel>>;
	updateSchedulerPeriods(testId: string, updateData: TestUpdateSchedulerPeriodsData): Promise<Array<TestSchedulerPeriodModel>>;
}
