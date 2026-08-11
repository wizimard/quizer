import { TestSchedulerPeriod } from '../../entities/test-scheduler-period';
import type { CreateTestSchedulerPeriodInput, UpdateTestSchedulerInput, UpdateTestSchedulerPeriodInput } from '../../interfaces/services/input/update-test-scheduler.input';
import type { TestUpdateSchedulerPeriodsData } from '../../interfaces/repository/test-scheduler.repository.interface';

export class SchedulerPeriodPersistenceMapper {
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
