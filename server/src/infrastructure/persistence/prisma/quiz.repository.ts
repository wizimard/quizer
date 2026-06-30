import { APP_TYPES } from '@app_types';
import { inject, injectable } from 'inversify';
import type { IPrismaService } from '@database';
import type { ILogger } from '@logger';
import type { IQuizEntity } from '@domain/quiz/quiz.entity.interface';
import type { IQuestionEntity } from '@domain/quiz/question.entity.interface';
import type { IQuizUpdateSettingsData, QuizRepository } from '@domain/quiz/ports/quiz.repository.port';
import { QUIZ_TYPES } from '@composition/quiz.types';
import { QuizPersistenceMapper } from '@infrastructure/persistence/mappers/quiz-persistence.mapper';
import { QuizMapper } from '@infrastructure/persistence/mappers/quiz.mapper';
import { repositoryCall } from '@common/utils/repository-call';
import type { TQuizModelAll } from './prisma-quiz.types';
import type { QuizModel } from '@prisma/browser';

const FULL_QUIZ_INCLUDE = {
	questions: true,
	quizSettings: {
		include: {
			availablePeriods: true,
		},
	},
} as const;

@injectable()
export class PrismaQuizRepository implements QuizRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(QUIZ_TYPES.QUIZ_PERSISTENCE_MAPPER) private readonly quizPersistenceMapper: QuizPersistenceMapper,
		@inject(QUIZ_TYPES.QUIZ_MAPPER) private readonly quizMapper: QuizMapper,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async create(entity: IQuizEntity): Promise<IQuizEntity> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.create({
					data: this.quizPersistenceMapper.toCreateData(entity),
					include: FULL_QUIZ_INCLUDE,
				}),
			'PrismaQuizRepository.create',
			this.logger,
		);

		return this.quizMapper.toDomain(row);
	}

	async update(entity: IQuizEntity, addQuestions: IQuestionEntity[], updateQuestions: IQuestionEntity[], deleteQuestionsIds: string[]): Promise<IQuizEntity> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.update({
					where: { id: entity.id },
					data: this.quizPersistenceMapper.toUpdateData(entity, addQuestions, updateQuestions, deleteQuestionsIds),
					include: FULL_QUIZ_INCLUDE,
				}),
			'PrismaQuizRepository.update',
			this.logger,
		);

		return this.quizMapper.toDomain(row);
	}

	async delete(id: string): Promise<void> {
		await repositoryCall(
			() =>
				this.prismaService.client.quizModel.delete({
					where: { id },
				}),
			'PrismaQuizRepository.delete',
			this.logger,
		);
	}

	async findById(id: string): Promise<IQuizEntity | null> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.findUnique({
					where: { id },
				}),
			'PrismaQuizRepository.findById',
			this.logger,
		);

		return row ? this.quizMapper.toDomain(row) : null;
	}

	async findFullById(id: string): Promise<IQuizEntity | null> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.findUnique({
					where: { id },
					include: FULL_QUIZ_INCLUDE,
				}),
			'PrismaQuizRepository.findFullById',
			this.logger,
		);

		return row ? this.quizMapper.toDomain(row as TQuizModelAll) : null;
	}

	async findByAuthor(authorId: string): Promise<IQuizEntity[]> {
		const rows = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.findMany({
					where: { authorId },
				}),
			'PrismaQuizRepository.findByAuthor',
			this.logger,
		);

		return rows.map((row) => this.quizMapper.toDomain(row));
	}

	async updateSettings(quizId: string, updateSettingsData: IQuizUpdateSettingsData): Promise<IQuizEntity> {
		const row = await repositoryCall(
			() =>
				this.prismaService.client.quizModel.update({
					where: { id: quizId },
					data: this.quizPersistenceMapper.toSettingsUpdateInput(updateSettingsData),
					include: FULL_QUIZ_INCLUDE,
				}),
			'PrismaQuizRepository.updateSettings',
			this.logger,
		);

		return this.quizMapper.toDomain(row);
	}

	async startQuiz(quizId: string): Promise<QuizModel> {
		const row = await repositoryCall(() => this.prismaService.client.quizModel.update({ where: { id: quizId }, data: { isOpen: true } }), 'PrismaQuizRepository.startQuiz', this.logger);

		return row;
	}

	async finishQuiz(quizId: string): Promise<QuizModel> {
		const row = await repositoryCall(() => this.prismaService.client.quizModel.update({ where: { id: quizId }, data: { isOpen: false } }), 'PrismaQuizRepository.finishQuiz', this.logger);

		return row;
	}
}
