import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import type { IPrismaService } from '@shared/persistence';
import type { ILogger } from '@shared/logger';
import { repositoryCall } from '@shared/http/utils/repository-call';
import { TestSessionRunMode, type TestSessionModel } from '@prisma/client';
import type { BatchPayload } from '@prisma/internal/prismaNamespace';
import type { TestSessionRepository } from '../interfaces/repository/test-session.repository.interface';

@injectable()
export class PrismaTestSessionRepository implements TestSessionRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async startTest(testId: string, runMode: TestSessionRunMode, finishedAt?: Date): Promise<TestSessionModel | null> {
		const row: TestSessionModel | null = await repositoryCall(
			() =>
				this.prismaService.client.testSessionModel.create({
					data: { test_id: testId, started_at: new Date(), finished_at: finishedAt ?? null, run_mode: runMode },
				}),
			'PrismaTestSessionRepository startTest',
			this.logger,
		);

		return row;
	}

	async finishTest(testId: string): Promise<number> {
		const rows: BatchPayload | null = await repositoryCall(
			() =>
				this.prismaService.client.testSessionModel.updateMany({
					where: { status: 'ACTIVE', test_id: testId },
					data: { status: 'FINISHED', finished_at: new Date() },
				}),
			'PrismaTestSessionRepository finishTest',
			this.logger,
		);

		return rows ? rows.count : 0;
	}

	async nextQuestion(sessionId: string, questionId: string): Promise<TestSessionModel | null> {
		const row: TestSessionModel | null = await repositoryCall(
			async () => {
				return this.prismaService.client.testSessionModel.update({
					where: { id: sessionId },
					data: { current_question_id: questionId },
				});
			},
			'PrismaTestSessionRepository nextQuestion',
			this.logger,
		);

		return row;
	}
}
