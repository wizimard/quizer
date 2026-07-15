import { APP_TYPES } from '@app/app.types';
import { repositoryCall } from '@shared/http/utils/repository-call';
import type { ILogger } from '@shared/logger';
import type { IPrismaService } from '@shared/persistence';
import { injectable, inject } from 'inversify';
import type { Answer } from '../entities/answer';
import type { TestSessionAnswerModel } from '@prisma/client';
import { AnswerMapper } from '../mappers/answer.mapper';
import type { AnswerRepository } from '../interfaces/repositories/answer.repository';

@injectable()
export class PrismaAnswerRepository implements AnswerRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async createAnswer(answer: Answer, userId: string): Promise<Answer | null> {
		const row: TestSessionAnswerModel | null = await repositoryCall(
			() => {
				return this.prismaService.client.testSessionAnswerModel.create({
					data: AnswerMapper.toPersistenceCreate(answer, userId),
				});
			},
			'PrismaAnswerRepository.createAnswer',
			this.logger,
		);

		return row ? AnswerMapper.toDomain(row) : null;
	}
}
