import type {
	TestModelCreateArgs,
	TestModelUpdateArgs,
	TestModelUpdateInput,
	TestSchedulerPeriodModelCreateManyInput,
	TestSchedulerPeriodModelUpdateArgs,
	TestSchedulerPeriodModelWhereInput,
} from '@prisma/models';
import type { TestEntity } from '../../entities/test.entity';
import type { ITestUpdateSchedulerPeriodsData, ITestUpdateSettingsData } from '../../interfaces/repository/test.repository.interface';
import type { TestId } from '@modules/test-management';
import type { ITestSchedulerPeriod } from '@modules/test-management/interfaces/entities/test-scheduler-period.interface';

export interface ITestPersistenceUpdate {
	createData: Array<TestSchedulerPeriodModelCreateManyInput>;
	updateData: Array<TestSchedulerPeriodModelUpdateArgs>;
	deleteData: TestSchedulerPeriodModelWhereInput;
}

export const TestPersistenceMapper = {
	toCreateData(entity: TestEntity): TestModelCreateArgs['data'] {
		return {
			title: entity.title,
			author_id: entity.authorId.value,
			test_settings: {},
		};
	},

	toUpdateData(entity: TestEntity): TestModelUpdateInput {
		return {
			title: entity.title,
		};
	},

	toSettingsUpdateInput(updateSettingsData: ITestUpdateSettingsData): TestModelUpdateArgs['data'] {
		return {
			title: updateSettingsData.title,
			test_settings: {
				update: {
					show_answers_after_completion: updateSettingsData.isShowAnswersAfterCompletion,
					required_email: updateSettingsData.isRequiredEmail,
					required_first_name: updateSettingsData.isRequiredFirstName,
					required_last_name: updateSettingsData.isRequiredLastName,
				},
			},
		};
	},

	toSchedulerPeriodsUpdateInput(testId: string, data: ITestUpdateSchedulerPeriodsData): ITestPersistenceUpdate {
		const { add: addPeriods, update: updatePeriods, remove: deletePeriods } = data;

		const createData: Array<TestSchedulerPeriodModelCreateManyInput> = [];
		const updateData: Array<TestSchedulerPeriodModelUpdateArgs> = [];
		let deleteData: TestSchedulerPeriodModelWhereInput = {};

		if (addPeriods?.length) {
			createData.push(
				...addPeriods.map(
					(period: ITestSchedulerPeriod): TestSchedulerPeriodModelCreateManyInput => ({
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
					(period: ITestSchedulerPeriod): TestSchedulerPeriodModelUpdateArgs => ({
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
