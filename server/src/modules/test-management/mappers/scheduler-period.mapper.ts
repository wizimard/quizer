import type { TestSchedulerPeriodModel } from '@prisma/client';
import type { ITestSchedulerPeriod } from '../interfaces/entities/test-scheduler-period.interface';
import type { ITestUpdateSchedulerPeriodsData } from '../interfaces/repository/test.repository.interface';
import { TestId } from '../entities/value-object/test-id';
import { TestSchedulerPeriod } from '../entities/test-scheduler-period';
import type { CreateTestSchedulerPeriodInput, UpdateTestSchedulerInput, UpdateTestSchedulerPeriodInput } from '../interfaces/services/input/update-test-scheduler.input';
import type { ITestSchedulerResponse } from '../interfaces/http/scheduler-response.interface';

export class SchedulerPeriodMapper {
	static toResponse(period: ITestSchedulerPeriod): ITestSchedulerResponse['periods'][number] {
		return {
			id: period.id,
			testId: period.testId.value,
			availableFrom: period.availableFrom,
			availableTo: period.availableTo,
		};
	}

	static toDto(schedulerPeriod: TestSchedulerPeriodModel): ITestSchedulerPeriod {
		return {
			id: Number(schedulerPeriod.id),
			testId: TestId.of(schedulerPeriod.test_id),
			availableFrom: schedulerPeriod.available_from,
			availableTo: schedulerPeriod.available_to,
		};
	}

	static toRepositoryUpdateData(testId: TestId, data: UpdateTestSchedulerInput): ITestUpdateSchedulerPeriodsData {
		const updateData: ITestUpdateSchedulerPeriodsData = {
			add: [],
			update: [],
			remove: [],
		};

		const { add: addPeriods, update: updatePeriods, remove: deletePeriods } = data.schedulerPeriods;

		if (addPeriods?.length) {
			updateData.add = addPeriods.map((period: CreateTestSchedulerPeriodInput) => new TestSchedulerPeriod(0, testId, period.available_from, period.available_to));
		}

		if (updatePeriods?.length) {
			updateData.update = updatePeriods.map((period: UpdateTestSchedulerPeriodInput) => new TestSchedulerPeriod(period.id, testId, period.available_from, period.available_to));
		}

		if (deletePeriods?.length) {
			updateData.remove = deletePeriods;
		}

		return updateData;
	}
}
