import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import type { IPrismaService } from '@shared/persistence';
import type { ILogger } from '@shared/logger';
import { repositoryCall } from '@shared/http/utils/repository-call';
import { UserId } from '@modules/identity-access';
import type { TestEntity } from '../entities/test.entity';
import type { ITestUpdateSchedulerPeriodsData, ITestUpdateSettingsData, TestRepository, TTestModelAll, TTestModelWithSessions } from '../interfaces/repository/test.repository.interface';
import type { TestId } from '../entities/value-object/test-id';
import { TestMapper } from '../mappers/test.mapper';
import { TestPersistenceMapper } from '../mappers/repositories/test-persistence.mapper';
import type { PrismaPromise } from '@prisma/internal/prismaNamespace';

const FULL_TEST_INCLUDE = {
	questions: {
		orderBy: { sort_key: 'asc' },
	},
	test_settings: true,
	scheduler_periods: true,
	test_sessions: {
		where: {
			status: 'ACTIVE',
		},
	},
} as const;

const SHORT_TEST_INCLUDE = {
	test_sessions: {
		where: {
			status: 'ACTIVE',
		},
	},
} as const;

@injectable()
export class PrismaTestRepository implements TestRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async create(entity: TestEntity): Promise<TestEntity> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.testModel.create({
					data: TestPersistenceMapper.toCreateData(entity),
					include: FULL_TEST_INCLUDE,
				}),
			'PrismaTestRepository.create',
			this.logger,
		);

		return TestMapper.toDomain(row);
	}

	async update(entity: TestEntity): Promise<TestEntity> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.testModel.update({
					where: { id: entity.id.value },
					data: TestPersistenceMapper.toUpdateData(entity),
					include: FULL_TEST_INCLUDE,
				}),
			'PrismaTestRepository.update',
			this.logger,
		);

		return TestMapper.toDomain(row);
	}

	async delete(id: TestId): Promise<boolean> {
		const rows = await repositoryCall(
			() =>
				this.prismaService.client.testModel.deleteMany({
					where: { id: id.value },
				}),
			'PrismaTestRepository.delete',
			this.logger,
		);

		return rows.count > 0;
	}

	async findById(id: TestId): Promise<TestEntity | null> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.testModel.findUnique({
					where: { id: id.value },
				}),
			'PrismaTestRepository.findById',
			this.logger,
		);

		return row ? TestMapper.toDomain(row) : null;
	}

	async findFullById(id: TestId): Promise<TestEntity | null> {
		const row: TTestModelAll | null = await repositoryCall(
			() =>
				this.prismaService.client.testModel.findUnique({
					where: { id: id.value },
					include: FULL_TEST_INCLUDE,
				}),
			'PrismaTestRepository.findFullById',
			this.logger,
		);

		return row ? TestMapper.toDomain(row) : null;
	}

	async findByAuthor(authorId: UserId): Promise<TestEntity[]> {
		const rows: TTestModelWithSessions[] = await repositoryCall(
			() =>
				this.prismaService.client.testModel.findMany({
					where: { author_id: authorId.value },
					include: SHORT_TEST_INCLUDE,
				}),
			'PrismaTestRepository.findByAuthor',
			this.logger,
		);

		return rows.map((row: TTestModelWithSessions) => TestMapper.toDomain(row));
	}

	async updateSettings(testId: TestId, updateSettingsData: ITestUpdateSettingsData): Promise<TestEntity> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.testModel.update({
					where: { id: testId.value },
					data: TestPersistenceMapper.toSettingsUpdateInput(updateSettingsData),
					include: FULL_TEST_INCLUDE,
				}),
			'PrismaTestRepository.updateSettings',
			this.logger,
		);

		return TestMapper.toDomain(row);
	}

	async updateSchedulerPeriods(testId: TestId, data: ITestUpdateSchedulerPeriodsData): Promise<boolean> {
		const row = await repositoryCall(
			() => {
				const { createData, updateData, deleteData } = TestPersistenceMapper.toSchedulerPeriodsUpdateInput(testId, data);

				const transactions: Array<PrismaPromise<unknown>> = [];

				if (createData.length) {
					transactions.push(
						this.prismaService.client.testSchedulerPeriodModel.createMany({
							data: createData,
						}),
					);
				}

				if (updateData.length) {
					updateData.forEach((update) => {
						transactions.push(this.prismaService.client.testSchedulerPeriodModel.update(update));
					});
				}

				if (deleteData.id) {
					transactions.push(
						this.prismaService.client.testSchedulerPeriodModel.deleteMany({
							where: deleteData,
						}),
					);
				}

				return this.prismaService.client.$transaction(transactions);
			},
			'PrismaTestRepository.updateSchedulerPeriods',
			this.logger,
		);

		return true;
	}
}
