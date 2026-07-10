import type { TestEntity } from '@modules/test-management';

export interface UpdateTestSchedulerPeriodInput {
	id: number;
	available_from: Date;
	available_to?: Date;
}

export interface CreateTestSchedulerPeriodInput {
	available_from: Date;
	available_to?: Date;
}

export interface UpdateTestSchedulerInput {
	test: TestEntity;
	schedulerPeriods: {
		add?: Array<CreateTestSchedulerPeriodInput>;
		update?: Array<UpdateTestSchedulerPeriodInput>;
		remove?: Array<number>;
	};
}
