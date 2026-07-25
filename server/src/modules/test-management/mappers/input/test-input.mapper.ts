import type { TestCreateRequestDto } from '../../dto/http/request/test-create.request-dto';
import type { TestSettingsUpdateRequestDto } from '../../dto/http/request/test-settings-update.request-dto';
import type { TestSchedulerPeriodsEditRequestDto } from '../../dto/http/request/test-scheduler-periods-edit.request-dto';
import type { TestUpdateRequestDto } from '../../dto/http/request/test-update.request-dto';
import type { TestStartRequestDto } from '../../dto/http/request/test-start.request-dto';
import type { TestEntity } from '../../entities/test.entity';
import type { CreateTestInput } from '@modules/test-management/interfaces/services/input/create-test.input';
import type { UpdateTestSchedulerInput } from '@modules/test-management/interfaces/services/input/update-test-scheduler.input';
import type { UpdateTestSettingsInput } from '@modules/test-management/interfaces/services/input/update-test-settings.input';
import type { UpdateTestInput } from '@modules/test-management/interfaces/services/input/update-test.input';
import type { DeleteTestInput } from '@modules/test-management/interfaces/services/input/delete-test.input';
import type { GetTestByIdInput } from '@modules/test-management/interfaces/services/input/get-test-by-id.input';
import type { GetAuthorTestsInput } from '@modules/test-management/interfaces/services/input/get-author-tests.input';
import type { GetFullTestByIdInput } from '@modules/test-management/interfaces/services/input/get-full-test-by-id.input';
import type { StartTestInput } from '@modules/test-management/interfaces/services/input/start-test.input';
import type { FinishTestInput } from '@modules/test-management/interfaces/services/input/finish-test.input';
import type { NextQuestionInput } from '@modules/test-management/interfaces/services/input/next-question.input';
import type { TestGetOverviewInput } from '@modules/test-management/interfaces/services/input/test-get-overview.input';
import type { GetTestHistoryInput } from '@modules/test-management/interfaces/services/input/get-test-history.input';
import type { GetTestSessionOverviewInput } from '@modules/test-management/interfaces/services/input/get-test-session-overview.input';

export class TestInputMapper {
	static toGetByIdInput(testId: string): GetTestByIdInput {
		return {
			testId,
		};
	}

	static toGetFullByIdInput(testId: string, userId: string): GetFullTestByIdInput {
		return {
			testId,
			userId,
		};
	}

	static toGetByAuthorInput(authorId: string): GetAuthorTestsInput {
		return {
			authorId,
		};
	}

	static toCreateInput(dto: TestCreateRequestDto, authorId: string): CreateTestInput {
		return {
			title: dto.title,
			authorId,
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
			test,
			authorId: test.authorId,
		};
	}

	static toUpdateSettingsInput(test: TestEntity, dto: TestSettingsUpdateRequestDto): UpdateTestSettingsInput {
		return {
			test,
			title: dto.title,
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
			runMode: dto.run_mode,
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

	static toGetOverviewInput(testId: string, userId: string): TestGetOverviewInput {
		return {
			testId,
			userId,
		};
	}

	static toNextQuestionInput(testId: string, questionId: string, userId: string): NextQuestionInput {
		return {
			testId,
			questionId,
			userId,
		};
	}

	static toGetTestHistoryInput(testId: string): GetTestHistoryInput {
		return {
			testId,
		};
	}

	static toGetTestSessionOverviewInput(testId: string, sessionId: string): GetTestSessionOverviewInput {
		return {
			testId,
			sessionId,
		};
	}
}
