import { inject, injectable } from 'inversify';
import { TM_TYPES } from '../test-management.types';
import { TestValidationFailedError } from '../utils/errors/test-validation-failed.error';
import type { TestRepository } from '../interfaces/repository/test.repository.interface';
import { TestValidator } from '../utils/validators/test.validator';
import { SchedulerPeriodMapper } from '../mappers/scheduler-period.mapper';
import type { TestSchedulerPeriodModel } from '@prisma/client';
import type { DeleteTestInput } from '../interfaces/services/input/delete-test.input';
import type { CreateTestInput } from '../interfaces/services/input/create-test.input';
import type { GetAuthorTestsInput } from '../interfaces/services/input/get-author-tests.input';
import type { UpdateTestSchedulerInput } from '../interfaces/services/input/update-test-scheduler.input';
import type { UpdateTestSettingsInput } from '../interfaces/services/input/update-test-settings.input';
import type { UpdateTestInput } from '../interfaces/services/input/update-test.input';
import { TestNotFoundError, type TestEntity, TestNotOwnedError } from '..';
import type { ITestValidationError } from '../interfaces/error/test-validation.error.interface';
import type { ITestService } from '../interfaces/services/test.service.interface';
import type { TestFullResult } from '../interfaces/services/results/test-full.result';
import type { TestResult } from '../interfaces/services/results/test.result';
import type { TestSchedulerResultPeriod } from '../interfaces/services/results/test-scheduler.result';
import { TestMapper } from '../mappers/test.mapper';
import type { GetTestByIdInput } from '../interfaces/services/input/get-test-by-id.input';
import { SchedulerEditPeriodsValidationFailedError } from '../utils/errors/scheduler-edit-periods-validation-failed.error';
import type { TestSchedulerPeriod } from '../entities/test-scheduler-period';
import { SchedulerPeriodNotFoundError } from '../utils/errors/scheduler-period-not-found.error';
import { TestOpenError } from '../utils/errors/test-open.error';
import type { ILogger } from '@shared/logger';
import { APP_TYPES } from '@app/app.types';
import type { GetFullTestByIdInput } from '../interfaces/services/input/get-full-test-by-id.input';

@injectable()
export class TestService implements ITestService {
	constructor(
		@inject(TM_TYPES.TEST_REPOSITORY) private readonly testRepository: TestRepository,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async create(input: CreateTestInput): Promise<TestFullResult> {
		this.logger.info({ message: '[TestService create] start', data: input });

		const testEntity: TestEntity = TestMapper.buildTestFromCreateInput(input);
		const errors: ITestValidationError = TestValidator.validate(testEntity);

		if (errors.errors.length || errors.questionsErrors.length) {
			throw new TestValidationFailedError(errors, 'TestService.create');
		}

		const createdTest: TestEntity = await this.testRepository.create(testEntity);

		this.logger.info({ message: '[TestService create] test created', data: createdTest });

		return TestMapper.toFullResult(createdTest);
	}

	async update(input: UpdateTestInput): Promise<TestFullResult> {
		this.logger.info({ message: '[TestService update] start', data: input });

		const test: TestEntity = input.test;

		if (input.changes.title) {
			test.title = input.changes.title;
		}

		const updatedTest: TestEntity = await this.testRepository.update(test);

		this.logger.info({ message: '[TestService update] test updated', data: updatedTest });

		return TestMapper.toFullResult(updatedTest);
	}

	async delete(input: DeleteTestInput): Promise<void> {
		this.logger.info({ message: '[TestService delete] start', data: input });

		if (input.test.isOpen) {
			throw new TestOpenError('TestService.delete', 'errors.delete_test_open');
		}

		this.logger.info('[TestService delete] test deleted');

		await this.testRepository.delete(input.test.id.value);
	}

	async getByAuthor(input: GetAuthorTestsInput): Promise<TestResult[]> {
		this.logger.info({ message: '[TestService getByAuthor] start', data: input });

		const tests: TestEntity[] = await this.testRepository.findByAuthor(input.authorId.value);

		return tests.map(TestMapper.toResult);
	}

	async updateSettings(input: UpdateTestSettingsInput): Promise<TestFullResult> {
		this.logger.info({ message: '[TestService updateSettings] start', data: input });

		const test: TestEntity = input.test;

		const updatedTest: TestEntity = await this.testRepository.updateSettings(test.id.value, input);

		this.logger.info({ message: '[TestService updateSettings] test updated', data: updatedTest });

		return TestMapper.toFullResult(updatedTest);
	}

	async updateSchedulerPeriods(input: UpdateTestSchedulerInput): Promise<Array<TestSchedulerResultPeriod>> {
		this.logger.info({ message: '[TestService updateSchedulerPeriods] start', data: input });

		const schedulerPeriods: Array<TestSchedulerPeriod> = (await this.testRepository.getScheduler(input.test.id.value)).map(SchedulerPeriodMapper.toDomain);

		const checkDate = new Date();
		checkDate.setTime(checkDate.getTime() + 5 * 60 * 1000);

		for (const period of input.schedulerPeriods.update ?? []) {
			const currentPeriod = schedulerPeriods.find((p) => p.id === period.id);

			if (!currentPeriod) {
				throw new SchedulerPeriodNotFoundError('TestService.updateSchedulerPeriods');
			}

			if (currentPeriod.availableFrom <= checkDate) {
				throw new SchedulerEditPeriodsValidationFailedError('errors.scheduler_update_periods_time');
			}
		}

		for (const deletePeriodId of input.schedulerPeriods.remove ?? []) {
			const currentPeriod = schedulerPeriods.find((p) => p.id === deletePeriodId);

			if (!currentPeriod) {
				throw new SchedulerPeriodNotFoundError('TestService.updateSchedulerPeriods');
			}

			if (currentPeriod.availableFrom <= checkDate) {
				throw new SchedulerEditPeriodsValidationFailedError('errors.scheduler_update_periods_time');
			}
		}

		const test: TestEntity = input.test;

		const updatedSchedulerPeriods: Array<TestSchedulerPeriodModel> = await this.testRepository.updateSchedulerPeriods(test.id.value, SchedulerPeriodMapper.toRepositoryUpdateData(test.id, input));

		this.logger.info({ message: '[TestService updateSchedulerPeriods] scheduler periods updated', data: updatedSchedulerPeriods });

		return updatedSchedulerPeriods.map(SchedulerPeriodMapper.toDomain).map(SchedulerPeriodMapper.toResult);
	}

	async getFullById(input: GetFullTestByIdInput): Promise<TestFullResult> {
		this.logger.info({ message: '[TestService getFullById] start', data: input });

		const test: TestEntity | null = await this.testRepository.findFullById(input.testId.value);

		if (!test) {
			throw new TestNotFoundError('TestService.getFullById');
		}

		if (!test.authorId.equals(input.userId)) {
			throw new TestNotOwnedError('TestService.getFullById');
		}

		this.logger.info({ message: '[TestService getFullById] test found', data: test });

		return TestMapper.toFullResult(test);
	}

	async getById(input: GetTestByIdInput): Promise<TestResult> {
		this.logger.info({ message: '[TestService getById] start', data: input });

		const test: TestEntity | null = await this.testRepository.findById(input.testId.value);

		if (!test) {
			throw new TestNotFoundError('TestService.getById');
		}

		this.logger.info({ message: '[TestService getById] test found', data: test });

		return TestMapper.toResult(test);
	}
}
