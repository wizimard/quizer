import { inject, injectable } from 'inversify';
import { TM_TYPES } from '../test-management.types';
import type { UpdateTestSettingsInput } from '../interfaces/services/input/update-test-settings.input';
import type { TestSettingsService } from '../interfaces/services/test-settings.service.interface';
import type { TestFullResult } from '../interfaces/services/results/test-full.result';
import { TestMapper } from '../mappers/test.mapper';
import type { ILogger } from '@shared/logger';
import { APP_TYPES } from '@app/app.types';
import { HttpError } from '@shared/error';
import type { TestSettingsRepository } from '../interfaces/repository/test-settings.repository.interface';
import type { TestEntity } from '../entities/test.entity';

@injectable()
export class DefaultTestSettingsService implements TestSettingsService {
	constructor(
		@inject(TM_TYPES.TEST_SETTINGS_REPOSITORY) private readonly testSettingsRepository: TestSettingsRepository,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async updateSettings(input: UpdateTestSettingsInput): Promise<TestFullResult> {
		this.logger.info({ message: '[TestSettingsService updateSettings] start', data: input });

		const test: TestEntity = input.test;

		const updatedTest: TestEntity | null = await this.testSettingsRepository.updateSettings(test.id, input);

		if (!updatedTest) {
			throw new HttpError(500, 'test_not_updated', 'TestSettingsService.updateSettings');
		}

		this.logger.info({ message: '[TestSettingsService updateSettings] test updated', data: updatedTest });

		return TestMapper.toFullResult(updatedTest);
	}
}
