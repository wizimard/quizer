import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import type { IPrismaService } from '@shared/persistence';
import type { ILogger } from '@shared/logger';
import { repositoryCall } from '@shared/http/utils/repository-call';
import type { QuizId } from '@modules/quiz-management/domain/value-objects/quiz-id.vo';
import type { QuizExecutionRepository } from '../../../domain/repositories/quiz-execution.repository.port';
import type { ExecutableQuiz } from '../../../domain/read-models/executable-quiz.read-model';
import { QuestionReadMapper } from '../mappers/question-read.mapper';

@injectable()
export class PrismaQuizExecutionRepository implements QuizExecutionRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async startQuiz(id: QuizId): Promise<ExecutableQuiz> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.update({
					where: { id: id.value },
					data: { isOpen: true },
				}),
			'PrismaQuizExecutionRepository.startQuiz',
			this.logger,
		);

		return QuestionReadMapper.toExecutableQuiz(row);
	}

	async finishQuiz(id: QuizId): Promise<ExecutableQuiz> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.update({
					where: { id: id.value },
					data: { isOpen: false },
				}),
			'PrismaQuizExecutionRepository.finishQuiz',
			this.logger,
		);

		return QuestionReadMapper.toExecutableQuiz(row);
	}
}
