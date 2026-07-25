import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import type { IPrismaService } from '@shared/persistence';
import type { ILogger } from '@shared/logger';
import { repositoryCall } from '@shared/http/utils/repository-call';
import type { TestEntity } from '../entities/test.entity';
import type { TestRepository, TestModelAll, TestModelWithSessions } from '../interfaces/repository/test.repository.interface';
import { TestMapper } from '../mappers/test.mapper';
import { TestPersistenceMapper } from '../mappers/repositories/test-persistence.mapper';
import { FULL_TEST_INCLUDE, SHORT_TEST_INCLUDE } from './test-include.constant';

@injectable()
export class PrismaTestRepository implements TestRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async create(test: TestEntity): Promise<TestEntity | null> {
		const row: TestModelAll | null = await repositoryCall(
			() =>
				this.prismaService.client.testModel.create({
					data: TestPersistenceMapper.toCreateData(test),
					include: FULL_TEST_INCLUDE,
				}),
			'PrismaTestRepository create',
			this.logger,
		);

		return row ? TestMapper.toDomain(row) : null;
	}

	async update(test: TestEntity): Promise<TestEntity | null> {
		const row: TestModelAll | null = await repositoryCall(
			() =>
				this.prismaService.client.testModel.update({
					where: { id: test.id },
					data: TestPersistenceMapper.toUpdateData(test),
					include: FULL_TEST_INCLUDE,
				}),
			'PrismaTestRepository update',
			this.logger,
		);

		return row ? TestMapper.toDomain(row) : null;
	}

	async delete(testId: string): Promise<boolean> {
		const rows: { count: number } | null = await repositoryCall(
			() =>
				this.prismaService.client.testModel.deleteMany({
					where: { id: testId },
				}),
			'PrismaTestRepository delete',
			this.logger,
		);

		return rows ? rows.count > 0 : false;
	}

	async findById(testId: string): Promise<TestEntity | null> {
		const row: TestModelWithSessions | null = await repositoryCall(
			() =>
				this.prismaService.client.testModel.findUnique({
					where: { id: testId },
					include: SHORT_TEST_INCLUDE,
				}),
			'PrismaTestRepository findById',
			this.logger,
		);

		return row ? TestMapper.toDomain(row) : null;
	}

	async findFullById(testId: string): Promise<TestEntity | null> {
		const row: TestModelAll | null = await repositoryCall(
			() =>
				this.prismaService.client.testModel.findUnique({
					where: { id: testId },
					include: FULL_TEST_INCLUDE,
				}),
			'PrismaTestRepository findFullById',
			this.logger,
		);

		return row ? TestMapper.toDomain(row) : null;
	}

	async findByAuthor(authorId: string): Promise<TestEntity[]> {
		const rows: TestModelWithSessions[] | null = await repositoryCall(
			() =>
				this.prismaService.client.testModel.findMany({
					where: { author_id: authorId },
					include: SHORT_TEST_INCLUDE,
				}),
			'PrismaTestRepository findByAuthor',
			this.logger,
		);

		return rows ? rows.map((row: TestModelWithSessions) => TestMapper.toDomain(row)) : [];
	}
}
