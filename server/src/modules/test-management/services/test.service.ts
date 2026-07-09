import { UserId } from '@modules/identity-access';
import { inject, injectable } from 'inversify';
import { TM_TYPES } from '../test-management.types';
import { TestSettings } from '../entities/test-settings';
import { TestValidationFailedError } from '../utils/errors/test-validation-failed.error';
import type { TestRepository } from '../interfaces/repository/test.repository.interface';
import type { TestDto } from '../dto/entities/test.entity.dto';
import { buildTestFromCreateInput } from '../mappers/test-entity.mapper';
import { toTestDto } from '../mappers/to-test.dto';
import { TestValidator } from '../utils/validators/test.validator';
import type { CreateTestInput, GetAuthorTestsInput, UpdateTestSchedulerPeriodsInput, UpdateTestInput, UpdateTestSettingsInput } from '../interfaces/input/test.input';
import type { TestEntity } from '../entities/test.entity';

@injectable()
export class TestService {
	constructor(@inject(TM_TYPES.TEST_REPOSITORY) private readonly testRepository: TestRepository) {}

	async create(input: CreateTestInput): Promise<TestDto> {
		const testEntity = buildTestFromCreateInput(input);
		const errors = TestValidator.validate(testEntity);

		if (errors.errors.length || errors.questionsErrors.length) {
			throw new TestValidationFailedError(errors, 'TestService.create');
		}

		const createdtest = await this.testRepository.create(testEntity);

		return toTestDto(createdtest);
	}

	async update(test: TestEntity, input: UpdateTestInput): Promise<TestDto> {
		if (input.title) {
			test.updateTitle(input.title);
		}

		const updatedtest = await this.testRepository.update(test);

		return toTestDto(updatedtest);
	}

	async delete(test: TestEntity): Promise<void> {
		await this.testRepository.delete(test.id);
	}

	async getByAuthor(input: GetAuthorTestsInput): Promise<TestDto[]> {
		const testzes = await this.testRepository.findByAuthor(UserId.of(input.authorId));

		return testzes.map(toTestDto);
	}

	async updateSettings(test: TestEntity, input: UpdateTestSettingsInput): Promise<TestDto> {
		const updateSettingsData = TestSettings.buildUpdateData({
			title: input.title,
			isRequiredEmail: input.isRequiredEmail,
			isRequiredFirstName: input.isRequiredFirstName,
			isRequiredLastName: input.isRequiredLastName,
			isShowAnswersAfterCompletion: input.isShowAnswersAfterCompletion,
		});

		const updatedtest = await this.testRepository.updateSettings(test.id, updateSettingsData);

		return toTestDto(updatedtest);
	}

	async updateSchedulerPeriods(test: TestEntity, input: UpdateTestSchedulerPeriodsInput): Promise<unknown> {
		const updateData = TestSettings.buildSchedulerPeriodsUpdateData(test.id, input.availablePeriods);
		const updatedtest = await this.testRepository.updateSchedulerPeriods(test.id, updateData);

		return toTestDto(updatedtest);
	}
}
