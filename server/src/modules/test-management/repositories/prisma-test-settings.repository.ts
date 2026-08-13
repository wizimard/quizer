import { inject, injectable } from 'inversify';
import type { TestUpdateSettingsData, TestSettingsRepository } from '../interfaces/repository/test-settings.repository.interface';
import { APP_TYPES } from '@app/app.types';
import type { ILogger } from '@shared/logger';
import type { IPrismaService } from '@shared/persistence';
import { repositoryCall } from '@shared/http/utils/repository-call';
import type { TestEntity } from '..';
import type { TestModelAll } from '../interfaces/repository/test.repository.interface';
import { TestPersistenceMapper } from '../mappers/repositories/test-persistence.mapper';
import { TestMapper } from '../mappers/test.mapper';
import { FULL_TEST_INCLUDE } from './test-include.constant';

@injectable()
export class PrismaTestSettingsRepository implements TestSettingsRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async updateSettings(testId: string, updateSettingsData: TestUpdateSettingsData): Promise<TestEntity | null> {
		const row: TestModelAll | null = await repositoryCall(
			() =>
				this.prismaService.client.testModel.update({
					where: { id: testId },
					data: TestPersistenceMapper.toSettingsUpdateInput(updateSettingsData),
					include: FULL_TEST_INCLUDE,
				}),
			'PrismaTestSettingsRepository updateSettings',
			this.logger,
		);

		return row ? TestMapper.toDomain(row) : null;
	}
}
