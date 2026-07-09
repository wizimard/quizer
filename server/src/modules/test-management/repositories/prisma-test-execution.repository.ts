import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import type { IPrismaService } from '@shared/persistence';
import type { ILogger } from '@shared/logger';
import { repositoryCall } from '@shared/http/utils/repository-call';
import type { TestId } from '../entities/value-object/test-id';
import type { TestExecutionRepository } from '../interfaces/repository/test-execution.repository.interface';
import type { ExecutableTest } from '../entities/executable-test';
import { ExecutableTestMapper } from '../mappers/executable-test.mapper';
import type { UserId } from '@modules/identity-access';

const TEST_INCLUDE_SESSIONS = {
	test_sessions: true,
} as const;

@injectable()
export class PrismaTestExecutionRepository implements TestExecutionRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async startTest(id: TestId, userId: UserId, finishedAt?: Date): Promise<ExecutableTest> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.testModel.update({
					where: { id: id.value, author_id: userId.value },
					data: {
						test_sessions: {
							create: finishedAt === undefined ? {} : { finished_at: finishedAt },
						},
					},
					include: TEST_INCLUDE_SESSIONS,
				} as const),
			'PrismaTestExecutionRepository.startTest',
			this.logger,
		);

		return ExecutableTestMapper.toReadModel(row);
	}

	async finishTest(id: TestId, userId: UserId): Promise<ExecutableTest> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.testModel.update({
					where: { id: id.value, author_id: userId.value },
					data: {
						test_sessions: {
							updateMany: {
								where: { status: 'ACTIVE', test_id: id.value },
								data: { status: 'FINISHED', finished_at: new Date() },
							},
						},
					},
					include: TEST_INCLUDE_SESSIONS,
				} as const),
			'PrismaTestExecutionRepository.finishTest',
			this.logger,
		);

		return ExecutableTestMapper.toReadModel(row);
	}
}
