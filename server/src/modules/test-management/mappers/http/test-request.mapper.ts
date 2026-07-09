import type { TestCreateDto } from '../../dto/http/test-create.dto';
import type { TestSettingsUpdateDto } from '../../dto/http/test-settings-update.dto';
import type { TestSchedulerPeriodsEditDto } from '../../dto/http/test-scheduler-periods-edit.dto';
import type { TestUpdateDto } from '../../dto/http/test-update.dto';
import type { CreateTestInput, UpdateTestSchedulerPeriodsInput, UpdateTestInput, UpdateTestSettingsInput } from '../../interfaces/input/test.input';
import type { TestStartDto } from '../../dto/http/test-start.dto';
import type { StartTestInput } from '@modules/test-execution/types/start-test.input';
import type { TestEntity } from '../../entities/test.entity';
import type { FinishTestInput } from '@modules/test-execution/types/finish-test.input';

export class TestRequestMapper {
	static toCreateInput(dto: TestCreateDto, authorId: string): CreateTestInput {
		return {
			title: dto.title,
			authorId,
		};
	}

	static toUpdateInput(test: TestEntity, dto: TestUpdateDto): UpdateTestInput {
		const input: UpdateTestInput = {
			id: test.id.value,
			authorId: test.authorId.value,
		};

		if (dto.title !== undefined) {
			input.title = dto.title;
		}

		return input;
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

	static toUpdateSchedulerPeriodsInput(test: TestEntity, dto: TestSchedulerPeriodsEditDto): UpdateTestSchedulerPeriodsInput {
		const input: UpdateTestSchedulerPeriodsInput = {
			test,
			availablePeriods: {},
		};

		if (dto.add?.length) {
			input.availablePeriods.add = dto.add.map((period) => {
				const item: { available_from: Date; available_to?: Date } = { available_from: new Date(period.available_from) };
				if (period.available_to !== undefined) {
					item.available_to = new Date(period.available_to);
				}
				return item;
			});
		}

		if (dto.update?.length) {
			input.availablePeriods.update = dto.update.map((period) => {
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
			input.availablePeriods.remove = dto.remove;
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
