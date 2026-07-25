import type {
	TestModelCreateArgs,
	TestModelUpdateArgs,
	TestModelUpdateInput,
	TestSchedulerPeriodModelCreateManyInput,
	TestSchedulerPeriodModelUpdateArgs,
	TestSchedulerPeriodModelWhereInput,
} from '@prisma/models';
import type { TestEntity } from '../../entities/test.entity';
import type { TestSchedulerPeriod } from '@modules/test-management/entities/test-scheduler-period';
import type { TestUpdateSettingsData } from '@modules/test-management/interfaces/repository/test-settings.repository.interface';
import type { TestUpdateSchedulerPeriodsData } from '@modules/test-management/interfaces/repository/test-scheduler.repository.interface';

export interface ITestPersistenceUpdate {
	createData: Array<TestSchedulerPeriodModelCreateManyInput>;
	updateData: Array<TestSchedulerPeriodModelUpdateArgs>;
	deleteData: TestSchedulerPeriodModelWhereInput;
}

export const TestPersistenceMapper = {
	toCreateData(entity: TestEntity): TestModelCreateArgs['data'] {
		return {
			title: entity.title,
			author_id: entity.authorId,
			test_settings: {
				create: {},
			},
		};
	},

	toUpdateData(entity: TestEntity): TestModelUpdateInput {
		return {
			title: entity.title,
		};
	},

	toSettingsUpdateInput(updateSettingsData: TestUpdateSettingsData): TestModelUpdateArgs['data'] {
		const settingsData = {
			show_answers_after_completion: updateSettingsData.isShowAnswersAfterCompletion,
		};

		return {
			title: updateSettingsData.title,
			test_settings: {
				update: settingsData,
			},
		};
	},

	toSchedulerPeriodsUpdateInput(testId: string, data: TestUpdateSchedulerPeriodsData): ITestPersistenceUpdate {
		const { add: addPeriods, update: updatePeriods, remove: deletePeriods } = data;

		const createData: Array<TestSchedulerPeriodModelCreateManyInput> = [];
		const updateData: Array<TestSchedulerPeriodModelUpdateArgs> = [];
		let deleteData: TestSchedulerPeriodModelWhereInput = {};

		if (addPeriods?.length) {
			createData.push(
				...addPeriods.map(
					(period: TestSchedulerPeriod): TestSchedulerPeriodModelCreateManyInput => ({
						test_id: testId,
						available_from: period.availableFrom,
						available_to: period.availableTo ?? null,
					}),
				),
			);
		}

		const now: Date = new Date();

		if (updatePeriods?.length) {
			updateData.push(
				...updatePeriods.map(
					(period: TestSchedulerPeriod): TestSchedulerPeriodModelUpdateArgs => ({
						where: { id: period.id, available_from: { gt: now } },
						data: { available_from: period.availableFrom, available_to: period.availableTo ?? null },
					}),
				),
			);
		}

		if (deletePeriods?.length) {
			deleteData = {
				id: {
					in: deletePeriods,
				},
				available_from: { gt: now },
			};
		}

		return {
			createData,
			updateData,
			deleteData,
		};
	},
};
