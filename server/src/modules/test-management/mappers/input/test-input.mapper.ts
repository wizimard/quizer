import type { TestCreateRequestDto } from '../../dto/http/request/test-create.request-dto';
import type { TestSettingsUpdateRequestDto } from '../../dto/http/request/test-settings-update.request-dto';
import type { TestSchedulerPeriodsEditRequestDto } from '../../dto/http/request/test-scheduler-periods-edit.request-dto';
import type { TestUpdateRequestDto } from '../../dto/http/request/test-update.request-dto';
import type { TestStartRequestDto } from '../../dto/http/request/test-start.request-dto';
import type { TestEntity } from '../../entities/test.entity';
import type { FinishTestInput } from '@modules/test-execution/types/finish-test.input';
import type { StartTestInput } from '@modules/test-execution/types/start-test.input';
import type { CreateTestInput } from '@modules/test-management/interfaces/services/input/create-test.input';
import type { UpdateTestSchedulerInput } from '@modules/test-management/interfaces/services/input/update-test-scheduler.input';
import type { UpdateTestSettingsInput } from '@modules/test-management/interfaces/services/input/update-test-settings.input';
import type { UpdateTestInput } from '@modules/test-management/interfaces/services/input/update-test.input';
import type { DeleteTestInput } from '@modules/test-management/interfaces/services/input/delete-test.input';
import type { GetTestByIdInput } from '@modules/test-management/interfaces/services/input/get-test-by-id.input';
import type { GetAuthorTestsInput } from '@modules/test-management/interfaces/services/input/get-author-tests.input';
import { TestId } from '@modules/test-management';
import { UserId } from '@modules/identity-access';

export class TestInputMapper {
	static toGetByIdInput(testId: string, userId: string): GetTestByIdInput {
		return {
			testId: TestId.of(testId),
			userId: UserId.of(userId),
		};
	}

	static toGetByAuthorInput(authorId: string): GetAuthorTestsInput {
		return {
			authorId: UserId.of(authorId),
		};
	}

	static toCreateInput(dto: TestCreateRequestDto, authorId: string): CreateTestInput {
		return {
			title: dto.title,
			authorId: UserId.of(authorId),
		};
	}

	static toUpdateInput(test: TestEntity, dto: TestUpdateRequestDto): UpdateTestInput {
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
			testId: test.id,
			authorId: test.authorId,
		};
	}

	static toUpdateSettingsInput(test: TestEntity, dto: TestSettingsUpdateRequestDto): UpdateTestSettingsInput {
		return {
			test,
			title: dto.title,
			isRequiredEmail: dto.required_email,
			isRequiredFirstName: dto.required_first_name,
			isRequiredLastName: dto.required_last_name,
			isShowAnswersAfterCompletion: dto.show_answers_after_completion,
		};
	}

	static toUpdateSchedulerPeriodsInput(test: TestEntity, dto: TestSchedulerPeriodsEditRequestDto): UpdateTestSchedulerInput {
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

	static toStartInput(test: TestEntity, dto: TestStartRequestDto): StartTestInput {
		const startInput: StartTestInput = {
			test,
		};

		if (dto.duration) {
			startInput.finishedAt = new Date(Date.now() + dto.duration * 1000);
		}

		return startInput;
	}

	static toFinishInput(test: TestEntity): FinishTestInput {
		return {
			test,
		};
	}
}
