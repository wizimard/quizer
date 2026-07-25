import type { TestSchedulerPeriodModel } from '@prisma/client';
import { TestSchedulerPeriod } from '../entities/test-scheduler-period';
import type { CreateTestSchedulerPeriodInput, UpdateTestSchedulerInput, UpdateTestSchedulerPeriodInput } from '../interfaces/services/input/update-test-scheduler.input';
import type { TestSchedulerResponsePeriod } from '../dto/http/response/test-scheduler.response-dto';
import type { TestSchedulerResultPeriod } from '../interfaces/services/results/test-scheduler.result';
import type { TestUpdateSchedulerPeriodsData } from '../interfaces/repository/test-scheduler.repository.interface';

export class SchedulerPeriodMapper {
	static toDomain(period: TestSchedulerPeriodModel): TestSchedulerPeriod {
		return new TestSchedulerPeriod(Number(period.id), period.test_id, period.available_from, period.available_to);
	}

	static toResponse(period: TestSchedulerResultPeriod): TestSchedulerResponsePeriod {
		return {
			id: period.id,
			test_id: period.testId,
			available_from: period.availableFrom,
			available_to: period.availableTo,
		};
	}

	static toResult(schedulerPeriod: TestSchedulerPeriod): TestSchedulerResultPeriod {
		return {
			id: Number(schedulerPeriod.id),
			testId: schedulerPeriod.testId,
			availableFrom: schedulerPeriod.availableFrom,
			availableTo: schedulerPeriod.availableTo,
		};
	}

	static toRepositoryUpdateData(testId: string, data: UpdateTestSchedulerInput): TestUpdateSchedulerPeriodsData {
		const updateData: TestUpdateSchedulerPeriodsData = {
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
