import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import type { IPrismaService } from '@shared/persistence';
import type { ILogger } from '@shared/logger';
import { repositoryCall } from '@shared/http/utils/repository-call';
import type { TestExecutionRepository } from '../interfaces/repository/test-execution.repository.interface';
import type { TestSessionModel } from '@prisma/client';
import type { BatchPayload } from '@prisma/internal/prismaNamespace';

@injectable()
export class PrismaTestExecutionRepository implements TestExecutionRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async startTest(testId: string, finishedAt?: Date): Promise<TestSessionModel | null> {
		const row: TestSessionModel | null = await repositoryCall(
			() =>
				this.prismaService.client.testSessionModel.create({
					data: { test_id: testId, started_at: new Date(), finished_at: finishedAt ?? null },
				}),
			'PrismaTestExecutionRepository.startTest',
			this.logger,
		);

		return row;
	}

	async finishTest(testId: string): Promise<number> {
		const rows: BatchPayload = await repositoryCall(
			() =>
				this.prismaService.client.testSessionModel.updateMany({
					where: { status: 'ACTIVE', test_id: testId },
					data: { status: 'FINISHED', finished_at: new Date() },
				}),
			'PrismaTestExecutionRepository.finishTest',
			this.logger,
		);

		return rows.count;
	}
}
