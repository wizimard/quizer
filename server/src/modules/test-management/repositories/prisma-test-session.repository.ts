import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import type { IPrismaService } from '@shared/persistence';
import type { ILogger } from '@shared/logger';
import { repositoryCall } from '@shared/http/utils/repository-call';
import { TestSessionRunMode, type TestSessionModel } from '@prisma/client';
import type { TestSessionHistoryModel, TestSessionRepository } from '../interfaces/repository/test-session.repository.interface';

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

	async finishTest(testId: string): Promise<TestSessionModel | null> {
		const rows: TestSessionModel[] | null = await repositoryCall(
			() =>
				this.prismaService.client.testSessionModel.updateManyAndReturn({
					where: { status: 'ACTIVE', test_id: testId },
					data: { status: 'FINISHED', finished_at: new Date() },
				}),
			'PrismaTestSessionRepository finishTest',
			this.logger,
		);

		return rows && rows[0] ? rows[0] : null;
	}

	async finishExpiredTests(): Promise<TestSessionModel[]> {
		const rows: TestSessionModel[] | null = await repositoryCall(
			() =>
				this.prismaService.client.testSessionModel.updateManyAndReturn({
					where: { status: 'ACTIVE', finished_at: { lte: new Date() } },
					data: { status: 'FINISHED', finished_at: new Date() },
				}),
			'PrismaTestSessionRepository finishExpiredTests',
			this.logger,
		);

		return rows ?? [];
	}

	async findActiveWithDeadline(): Promise<TestSessionModel[]> {
		const rows: TestSessionModel[] | null = await repositoryCall(
			() =>
				this.prismaService.client.testSessionModel.findMany({
					where: { status: 'ACTIVE', finished_at: { not: null } },
				}),
			'PrismaTestSessionRepository findActiveWithDeadline',
			this.logger,
		);

		return rows ?? [];
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

	async getTestHistory(testId: string): Promise<Array<TestSessionHistoryModel> | null> {
		const rows = await repositoryCall(
			() => {
				return this.prismaService.client.testSessionModel.findMany({
					where: { test_id: testId, finished_at: { not: null } },
					include: {
						test: true,
						_count: {
							select: {
								registered_users: true,
							},
						},
					},
					orderBy: {
						started_at: 'desc',
					},
				});
			},
			'PrismaTestSessionRepository getTestHistory',
			this.logger,
		);

		return rows;
	}

	async findById(sessionId: string, testId: string): Promise<TestSessionModel | null> {
		const row: TestSessionModel | null = await repositoryCall(
			() => this.prismaService.client.testSessionModel.findUnique({ where: { id: sessionId, test_id: testId } }),
			'PrismaTestSessionRepository findById',
			this.logger,
		);

		return row;
	}

	async getTestsHistory(authorId: string): Promise<Array<TestSessionHistoryModel> | null> {
		const rows: TestSessionHistoryModel[] | null = await repositoryCall(
			() => {
				return this.prismaService.client.testSessionModel.findMany({
					where: { test: { author_id: authorId }, finished_at: { not: null } },
					include: {
						test: true,
						_count: {
							select: {
								registered_users: true,
							},
						},
					},
					orderBy: {
						started_at: 'desc',
					},
				});
			},
			'PrismaTestSessionRepository getTestHistory',
			this.logger,
		);

		return rows;
	}
}
