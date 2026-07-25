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
import type { ITestValidationError } from '../interfaces/error/test-validation.error.interface';
import type { TestService } from '../interfaces/services/test.service.interface';
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
import { HttpError } from '@shared/error';
import type { TestSettingsRepository } from '../interfaces/repository/test-settings.repository.interface';
import type { TestSchedulerRepository } from '../interfaces/repository/test-scheduler.repository.interface';
import type { TestEntity } from '../entities/test.entity';
import { TestNotFoundError } from '../utils/errors/test-not-found.error';
import { TestNotOwnedError } from '../utils/errors/test-not-owned.error';

@injectable()
export class DefaultTestService implements TestService {
	constructor(
		@inject(TM_TYPES.TEST_REPOSITORY) private readonly testRepository: TestRepository,
		@inject(TM_TYPES.TEST_SETTINGS_REPOSITORY) private readonly testSettingsRepository: TestSettingsRepository,
		@inject(TM_TYPES.TEST_SCHEDULER_REPOSITORY) private readonly testSchedulerRepository: TestSchedulerRepository,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async create(input: CreateTestInput): Promise<TestFullResult> {
		this.logger.info({ message: '[TestService create] start', data: input });

		const testEntity: TestEntity = TestMapper.buildTestFromCreateInput(input);
		const errors: ITestValidationError = TestValidator.validate(testEntity);

		if (errors.errors.length || errors.questionsErrors.length) {
			throw new TestValidationFailedError(errors, 'TestService.create');
		}

		const createdTest: TestEntity | null = await this.testRepository.create(testEntity);

		if (!createdTest) {
			throw new HttpError(500, 'test_not_created', 'TestService.create');
		}

		this.logger.info({ message: '[TestService create] test created', data: createdTest });

		return TestMapper.toFullResult(createdTest);
	}

	async update(input: UpdateTestInput): Promise<TestFullResult> {
		this.logger.info({ message: '[TestService update] start', data: input });

		const test: TestEntity = input.test;

		if (input.changes.title) {
			test.title = input.changes.title;
		}

		const updatedTest: TestEntity | null = await this.testRepository.update(test);

		if (!updatedTest) {
			throw new HttpError(500, 'test_not_updated', 'TestService.update');
		}

		this.logger.info({ message: '[TestService update] test updated', data: updatedTest });

		return TestMapper.toFullResult(updatedTest);
	}

	async delete(input: DeleteTestInput): Promise<void> {
		this.logger.info({ message: '[TestService delete] start', data: input });

		if (input.test.isOpen) {
			throw new TestOpenError('TestService.delete', 'errors.delete_test_open');
		}

		this.logger.info('[TestService delete] test deleted');

		await this.testRepository.delete(input.test.id);
	}

	async getByAuthor(input: GetAuthorTestsInput): Promise<TestResult[]> {
		this.logger.info({ message: '[TestService getByAuthor] start', data: input });

		const tests: TestEntity[] = await this.testRepository.findByAuthor(input.authorId);

		return tests.map(TestMapper.toResult);
	}

	async updateSettings(input: UpdateTestSettingsInput): Promise<TestFullResult> {
		this.logger.info({ message: '[TestService updateSettings] start', data: input });

		const test: TestEntity = input.test;

		const updatedTest: TestEntity | null = await this.testSettingsRepository.updateSettings(test.id, input);

		if (!updatedTest) {
			throw new HttpError(500, 'test_not_updated', 'TestService.updateSettings');
		}

		this.logger.info({ message: '[TestService updateSettings] test updated', data: updatedTest });

		return TestMapper.toFullResult(updatedTest);
	}

	async updateSchedulerPeriods(input: UpdateTestSchedulerInput): Promise<Array<TestSchedulerResultPeriod>> {
		this.logger.info({ message: '[TestService updateSchedulerPeriods] start', data: input });

		const schedulerPeriods: Array<TestSchedulerPeriod> = (await this.testSchedulerRepository.getScheduler(input.test.id)).map(SchedulerPeriodMapper.toDomain);

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

		const updatedSchedulerPeriods: Array<TestSchedulerPeriodModel> = await this.testSchedulerRepository.updateSchedulerPeriods(
			test.id,
			SchedulerPeriodMapper.toRepositoryUpdateData(test.id, input),
		);

		this.logger.info({ message: '[TestService updateSchedulerPeriods] scheduler periods updated', data: updatedSchedulerPeriods });

		return updatedSchedulerPeriods.map(SchedulerPeriodMapper.toDomain).map(SchedulerPeriodMapper.toResult);
	}

	async getFullByIdAndCheckOwnership(input: GetFullTestByIdInput): Promise<TestFullResult> {
		this.logger.info({ message: '[TestService getFullById] start', data: input });

		const test: TestEntity | null = await this.getFullById(input.testId);

		if (!test) {
			throw new TestNotFoundError('TestService.getFullById');
		}

		if (test.authorId !== input.userId) {
			throw new TestNotOwnedError('TestService.getFullById');
		}

		this.logger.info({ message: '[TestService getFullById] test found', data: test });

		return TestMapper.toFullResult(test);
	}

	async getFullById(testId: string): Promise<TestEntity | null> {
		const test: TestEntity | null = await this.testRepository.findFullById(testId);

		return test;
	}

	async getById(input: GetTestByIdInput): Promise<TestResult> {
		this.logger.info({ message: '[TestService getById] start', data: input });

		const test: TestEntity | null = await this.testRepository.findById(input.testId);

		if (!test) {
			throw new TestNotFoundError('TestService.getById');
		}

		this.logger.info({ message: '[TestService getById] test found', data: test });

		return TestMapper.toResult(test);
	}
}
