import { inject, injectable } from 'inversify';
import { TM_TYPES } from '../test-management.types';
import { TestValidationFailedError } from '../utils/errors/test-validation-failed.error';
import type { TestRepository } from '../interfaces/repository/test.repository.interface';
import type { ITest } from '../interfaces/entities/test.interface';
import { buildTestFromCreateInput } from '../mappers/test-entity.mapper';
import { toTest } from '../mappers/to-test.dto';
import { TestValidator } from '../utils/validators/test.validator';
import type { ITestSchedulerPeriod } from '../interfaces/entities/test-scheduler-period.interface';
import { SchedulerPeriodMapper } from '../mappers/scheduler-period.mapper';
import type { TestSchedulerPeriodModel } from '@prisma/client';
import type { DeleteTestInput } from '../interfaces/services/input/delete-test.input';
import type { CreateTestInput } from '../interfaces/services/input/create-test.input';
import type { GetAuthorTestsInput } from '../interfaces/services/input/get-author-tests.input';
import type { UpdateTestSchedulerInput } from '../interfaces/services/input/update-test-scheduler.input';
import type { UpdateTestSettingsInput } from '../interfaces/services/input/update-test-settings.input';
import type { UpdateTestInput } from '../interfaces/services/input/update-test.input';
import type { TestEntity } from '..';
import type { ITestValidationError } from '../interfaces/error/test-validation.error.interface';
import type { ITestService } from '../interfaces/services/test.service.interface';

@injectable()
export class TestService implements ITestService {
	constructor(@inject(TM_TYPES.TEST_REPOSITORY) private readonly testRepository: TestRepository) {}

	async create(input: CreateTestInput): Promise<ITest> {
		const testEntity: TestEntity = buildTestFromCreateInput(input);
		const errors: ITestValidationError = TestValidator.validate(testEntity);

		if (errors.errors.length || errors.questionsErrors.length) {
			throw new TestValidationFailedError(errors, 'TestService.create');
		}

		const createdTest: TestEntity = await this.testRepository.create(testEntity);

		return toTest(createdTest);
	}

	async update(input: UpdateTestInput): Promise<ITest> {
		const test: TestEntity = input.test;

		if (input.changes.title) {
			test.title = input.changes.title;
		}

		const updatedTest: TestEntity = await this.testRepository.update(test);

		return toTest(updatedTest);
	}

	async delete(input: DeleteTestInput): Promise<void> {
		await this.testRepository.delete(input.testId);
	}

	async getByAuthor(input: GetAuthorTestsInput): Promise<ITest[]> {
		const tests: TestEntity[] = await this.testRepository.findByAuthor(input.authorId);

		return tests.map(toTest);
	}

	async updateSettings(input: UpdateTestSettingsInput): Promise<ITest> {
		const test: TestEntity = input.test;

		const updatedTest: TestEntity = await this.testRepository.updateSettings(test.id.value, input);

		return toTest(updatedTest);
	}

	async updateSchedulerPeriods(input: UpdateTestSchedulerInput): Promise<Array<ITestSchedulerPeriod>> {
		const test: TestEntity = input.test;

		const schedulerPeriods: Array<TestSchedulerPeriodModel> = await this.testRepository.updateSchedulerPeriods(test.id.value, SchedulerPeriodMapper.toRepositoryUpdateData(test.id, input));

		return schedulerPeriods.map(SchedulerPeriodMapper.toDto);
	}
}
