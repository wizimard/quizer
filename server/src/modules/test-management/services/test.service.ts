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
import { TestNotFoundError, type TestEntity } from '..';
import type { ITestValidationError } from '../interfaces/error/test-validation.error.interface';
import type { ITestService } from '../interfaces/services/test.service.interface';
import type { TestFullResult } from '../interfaces/services/results/test-full.result';
import type { TestResult } from '../interfaces/services/results/test.result';
import type { TestSchedulerResultPeriod } from '../interfaces/services/results/test-scheduler.result';
import { TestMapper } from '../mappers/test.mapper';
import type { GetTestByIdInput } from '../interfaces/services/input/get-test-by-id.input';

@injectable()
export class TestService implements ITestService {
	constructor(@inject(TM_TYPES.TEST_REPOSITORY) private readonly testRepository: TestRepository) {}

	async create(input: CreateTestInput): Promise<TestFullResult> {
		const testEntity: TestEntity = TestMapper.buildTestFromCreateInput(input);
		const errors: ITestValidationError = TestValidator.validate(testEntity);

		if (errors.errors.length || errors.questionsErrors.length) {
			throw new TestValidationFailedError(errors, 'TestService.create');
		}

		const createdTest: TestEntity = await this.testRepository.create(testEntity);

		return TestMapper.toFullResult(createdTest);
	}

	async update(input: UpdateTestInput): Promise<TestFullResult> {
		const test: TestEntity = input.test;

		if (input.changes.title) {
			test.title = input.changes.title;
		}

		const updatedTest: TestEntity = await this.testRepository.update(test);

		return TestMapper.toFullResult(updatedTest);
	}

	async delete(input: DeleteTestInput): Promise<void> {
		await this.testRepository.delete(input.testId.value);
	}

	async getByAuthor(input: GetAuthorTestsInput): Promise<TestResult[]> {
		const tests: TestEntity[] = await this.testRepository.findByAuthor(input.authorId.value);

		return tests.map(TestMapper.toResult);
	}

	async updateSettings(input: UpdateTestSettingsInput): Promise<TestFullResult> {
		const test: TestEntity = input.test;

		const updatedTest: TestEntity = await this.testRepository.updateSettings(test.id.value, input);

		return TestMapper.toFullResult(updatedTest);
	}

	async updateSchedulerPeriods(input: UpdateTestSchedulerInput): Promise<Array<TestSchedulerResultPeriod>> {
		const test: TestEntity = input.test;

		const schedulerPeriods: Array<TestSchedulerPeriodModel> = await this.testRepository.updateSchedulerPeriods(test.id.value, SchedulerPeriodMapper.toRepositoryUpdateData(test.id, input));

		return schedulerPeriods.map(SchedulerPeriodMapper.toDomain).map(SchedulerPeriodMapper.toResult);
	}

	async getFullById(input: GetTestByIdInput): Promise<TestFullResult> {
		const test: TestEntity | null = await this.testRepository.findFullById(input.testId.value);

		if (!test) {
			throw new TestNotFoundError('TestService.getFullById');
		}

		return TestMapper.toFullResult(test);
	}

	async getById(input: GetTestByIdInput): Promise<TestResult> {
		const test: TestEntity | null = await this.testRepository.findById(input.testId.value);

		if (!test) {
			throw new TestNotFoundError('TestService.getById');
		}

		return TestMapper.toResult(test);
	}
}
