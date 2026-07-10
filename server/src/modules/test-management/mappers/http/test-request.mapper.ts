import type { TestCreateDto } from '../../dto/http/test-create.dto';
import type { TestSettingsUpdateDto } from '../../dto/http/test-settings-update.dto';
import type { TestSchedulerPeriodsEditDto } from '../../dto/http/test-scheduler-periods-edit.dto';
import type { TestUpdateDto } from '../../dto/http/test-update.dto';
import type { TestStartDto } from '../../dto/http/test-start.dto';
import type { TestEntity } from '../../entities/test.entity';
import type { FinishTestInput } from '@modules/test-execution/types/finish-test.input';
import type { StartTestInput } from '@modules/test-execution/types/start-test.input';
import type { CreateTestInput } from '@modules/test-management/interfaces/services/input/create-test.input';
import type { UpdateTestSchedulerInput } from '@modules/test-management/interfaces/services/input/update-test-scheduler.input';
import type { UpdateTestSettingsInput } from '@modules/test-management/interfaces/services/input/update-test-settings.input';
import type { UpdateTestInput } from '@modules/test-management/interfaces/services/input/update-test.input';
import type { DeleteTestInput } from '@modules/test-management/interfaces/services/input/delete-test.input';

export class TestRequestMapper {
	static toCreateInput(dto: TestCreateDto, authorId: string): CreateTestInput {
		return {
			title: dto.title,
			authorId,
		};
	}

	static toUpdateInput(test: TestEntity, dto: TestUpdateDto): UpdateTestInput {
		const input: UpdateTestInput = {
			test,
			changes: {},
		};

		if (dto.title !== undefined) {
			input.changes.title = dto.title;
		}

		return input;
	}

	static toDeleteInput(test: TestEntity): DeleteTestInput {
		return {
			testId: test.id.value,
			authorId: test.authorId.value,
		};
	}

	static toUpdateSettingsInput(test: TestEntity, dto: TestSettingsUpdateDto): UpdateTestSettingsInput {
		return {
			test,
			title: dto.title,
			isRequiredEmail: dto.isRequiredEmail,
			isRequiredFirstName: dto.isRequiredFirstName,
			isRequiredLastName: dto.isRequiredLastName,
			isShowAnswersAfterCompletion: dto.isShowAnswersAfterCompletion,
		};
	}

	static toUpdateSchedulerPeriodsInput(test: TestEntity, dto: TestSchedulerPeriodsEditDto): UpdateTestSchedulerInput {
		const input: UpdateTestSchedulerInput = {
			test,
			schedulerPeriods: {},
		};

		if (dto.add?.length) {
			input.schedulerPeriods.add = dto.add.map((period) => {
				const item: { available_from: Date; available_to?: Date } = { available_from: new Date(period.available_from) };
				if (period.available_to !== undefined) {
					item.available_to = new Date(period.available_to);
				}
				return item;
			});
		}

		if (dto.update?.length) {
			input.schedulerPeriods.update = dto.update.map((period) => {
				const item: { id: number; available_from: Date; available_to?: Date } = {
					id: period.id,
					available_from: new Date(period.available_from),
				};
				if (period.available_to !== undefined) {
					item.available_to = new Date(period.available_to);
				}
				return item;
			});
		}

		if (dto.remove?.length) {
			input.schedulerPeriods.remove = dto.remove;
		}

		return input;
	}

	static toStartCommand(test: TestEntity, dto: TestStartDto): StartTestInput {
		const command: StartTestInput = {
			test,
		};

		if (dto.duration) {
			command.finishedAt = new Date(Date.now() + dto.duration * 1000);
		}

		return command;
	}

	static toFinishCommand(test: TestEntity): FinishTestInput {
		return {
			test,
		};
	}
}
