import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import type { IPrismaService } from '@shared/persistence';
import type { ILogger } from '@shared/logger';
import { repositoryCall } from '@shared/http/utils/repository-call';
import type { TestId } from '@modules/test-management/entities/value-object/test-id';
import type { QuestionReadRepository } from './question-read.repository.interface';
import type { QuestionReadModel } from '../entities/question-read.model';
import { QuestionReadMapper } from '../mappers/question-read.mapper';

@injectable()
export class PrismaQuestionReadRepository implements QuestionReadRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async findById(testId: TestId, questionId: string): Promise<QuestionReadModel | null> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.testQuestionModel.findUnique({
					where: {
						test_id: testId.value,
						id: questionId,
					},
				}),
			'PrismaQuestionReadRepository.findById',
			this.logger,
		);

		return row ? QuestionReadMapper.toReadModel(row) : null;
	}
}
