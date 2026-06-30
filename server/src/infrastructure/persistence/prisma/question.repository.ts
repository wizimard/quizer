import { inject, injectable } from 'inversify';
import type { IQuestionRepository, TQuestionCreateOrUpdateData } from './question.repository.interface';
import { APP_TYPES } from '@app_types';
import type { IPrismaService } from '@database';
import type { ILogger } from '@logger';
import type { QuizQuestionModel } from '@prisma/client';
import { repositoryCall } from '@common/utils/repository-call';

@injectable()
export class QuestionRepository implements IQuestionRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async getQuizQuestions(quizId: string): Promise<QuizQuestionModel[] | null> {
		return repositoryCall(
			() =>
				this.prismaService.client.quizQuestionModel.findMany({
					where: {
						quizId,
					},
				}),
			'QuestionRepository.getQuizQuestions',
			this.logger,
		);
	}

	async getQuestion(quizId: string, questionId: string): Promise<QuizQuestionModel | null> {
		return repositoryCall(
			() =>
				this.prismaService.client.quizQuestionModel.findUnique({
					where: {
						quizId,
						id: questionId,
					},
				}),
			'QuestionRepository.getQuestion',
			this.logger,
		);
	}

	async create(quizId: string, data: TQuestionCreateOrUpdateData): Promise<QuizQuestionModel | null> {
		return repositoryCall(
			() =>
				this.prismaService.client.quizQuestionModel.create({
					data: {
						...data,
						quizId,
					},
				}),
			'QuestionRepository.create',
			this.logger,
		);
	}

	async update(id: string, data: TQuestionCreateOrUpdateData): Promise<QuizQuestionModel | null> {
		return repositoryCall(
			() =>
				this.prismaService.client.quizQuestionModel.update({
					where: { id },
					data,
				}),
			'QuestionRepository.update',
			this.logger,
		);
	}

	async delete(id: string): Promise<QuizQuestionModel | null> {
		return repositoryCall(() => this.prismaService.client.quizQuestionModel.delete({ where: { id } }), 'QuestionRepository.delete', this.logger);
	}
}
