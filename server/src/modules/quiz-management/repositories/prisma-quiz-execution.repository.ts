import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import type { IPrismaService } from '@shared/persistence';
import type { ILogger } from '@shared/logger';
import { repositoryCall } from '@shared/http/utils/repository-call';
import type { QuizId } from '../entities/value-object/quiz-id';
import type { QuizExecutionRepository } from '../interfaces/repository/quiz-execution.repository.interface';
import type { ExecutableQuiz } from '../entities/executable-quiz';
import { ExecutableQuizMapper } from '../mappers/executable-quiz.mapper';
import type { UserId } from '@modules/identity-access';

const QUIZ_INCLUDE_SESSIONS = {
	quizSessions: true,
} as const;

@injectable()
export class PrismaQuizExecutionRepository implements QuizExecutionRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async startQuiz(id: QuizId, userId: UserId, finishedAt?: Date): Promise<ExecutableQuiz> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.update({
					where: { id: id.value, authorId: userId.value },
					data: {
						quizSessions: {
							create: finishedAt === undefined ? {} : { finishedAt },
						},
					},
					include: QUIZ_INCLUDE_SESSIONS,
				} as const),
			'PrismaQuizExecutionRepository.startQuiz',
			this.logger,
		);

		return ExecutableQuizMapper.toReadModel(row);
	}

	async finishQuiz(id: QuizId, userId: UserId): Promise<ExecutableQuiz> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.update({
					where: { id: id.value, authorId: userId.value },
					data: {
						quizSessions: {
							updateMany: {
								where: { status: 'ACTIVE', quizId: id.value },
								data: { status: 'FINISHED', finishedAt: new Date() },
							},
						},
					},
					include: QUIZ_INCLUDE_SESSIONS,
				} as const),
			'PrismaQuizExecutionRepository.finishQuiz',
			this.logger,
		);

		return ExecutableQuizMapper.toReadModel(row);
	}
}
