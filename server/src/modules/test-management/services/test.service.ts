import { inject, injectable } from 'inversify';
import { TM_TYPES } from '../test-management.types';
import { TestValidationFailedError } from '../utils/errors/test-validation-failed.error';
import type { TestRepository } from '../interfaces/repository/test.repository.interface';
import { TestValidator } from '../utils/validators/test.validator';
import type { DeleteTestInput } from '../interfaces/services/input/delete-test.input';
import type { CreateTestInput } from '../interfaces/services/input/create-test.input';
import type { GetAuthorTestsInput } from '../interfaces/services/input/get-author-tests.input';
import type { UpdateTestInput } from '../interfaces/services/input/update-test.input';
import type { ITestValidationError } from '../interfaces/error/test-validation.error.interface';
import type { TestService } from '../interfaces/services/test.service.interface';
import type { TestFullResult } from '../interfaces/services/results/test-full.result';
import type { TestResult } from '../interfaces/services/results/test.result';
import { TestMapper } from '../mappers/test.mapper';
import { TestResultMapper } from '../mappers/result/test-result.mapper';
import type { GetTestByIdInput } from '../interfaces/services/input/get-test-by-id.input';
import { TestOpenError } from '../utils/errors/test-open.error';
import type { ILogger } from '@shared/logger';
import { APP_TYPES } from '@app/app.types';
import type { GetFullTestByIdInput } from '../interfaces/services/input/get-full-test-by-id.input';
import { HttpError } from '@shared/error';
import type { TestEntity } from '../entities/test.entity';
import { TestNotFoundError } from '../utils/errors/test-not-found.error';
import { TestNotOwnedError } from '../utils/errors/test-not-owned.error';

@injectable()
export class DefaultTestService implements TestService {
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

		const createdTest: TestEntity | null = await this.testRepository.create(testEntity);

		if (!createdTest) {
			throw new HttpError(500, 'test_not_created', 'TestService.create');
		}

		this.logger.info({ message: '[TestService create] test created', data: createdTest });

		return TestResultMapper.toFullResult(createdTest);
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

		return TestResultMapper.toFullResult(updatedTest);
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

		return tests.map(TestResultMapper.toResult);
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

		return TestResultMapper.toFullResult(test);
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

		return TestResultMapper.toResult(test);
	}
}
