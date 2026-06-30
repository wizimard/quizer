import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import type { IPrismaService } from '@shared/persistence';
import type { ILogger } from '@shared/logger';
import { repositoryCall } from '@shared/http/utils/repository-call';
import type { QuizId } from '@modules/quiz-management/domain/value-objects/quiz-id.vo';
import type { QuestionReadRepository } from '../../../domain/repositories/question-read.repository.port';
import type { QuestionReadModel } from '../../../domain/read-models/question-read.model';
import { QuestionReadMapper } from '../mappers/question-read.mapper';

@injectable()
export class PrismaQuestionReadRepository implements QuestionReadRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async findById(quizId: QuizId, questionId: string): Promise<QuestionReadModel | null> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizQuestionModel.findUnique({
					where: {
						quizId: quizId.value,
						id: questionId,
					},
				}),
			'PrismaQuestionReadRepository.findById',
			this.logger,
		);

		return row ? QuestionReadMapper.toReadModel(row) : null;
	}
}
