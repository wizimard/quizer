import { APP_TYPES } from '@app_types';
import { inject, injectable } from 'inversify';
import type { PrismaService } from '@database';
import type { IQuizRepository, TQuizModelWithQuestions } from './quiz.repository.interface';
import type { QuizModel } from '@prisma/client';
import type { IQuizEntity } from '../entities/quiz.entity.interface';
import type { IQuestionEntity } from '../entities/question.entity.interface';
import type { BatchPayload } from '@prisma/internal/prismaNamespace';
import { QuestionMapper } from '../mappers/question.mapper';

@injectable()
export class QuizRepository implements IQuizRepository {
	private readonly questionMapper: QuestionMapper = new QuestionMapper();

	constructor(@inject(APP_TYPES.PRISMA) private readonly prismaService: PrismaService) {}

	async create(entity: IQuizEntity): Promise<TQuizModelWithQuestions | null> {
		try {
			return await this.prismaService.client.quizModel.create({
				data: {
					title: entity.title,
					authorId: entity.authorId,
					questions: {
						create: entity.questions.map((question) => this.questionMapper.toRepositoryUpdateFromEntity(question)),
					},
				},
				include: {
					questions: true,
				},
			});
		} catch {
			return null;
		}
	}

	async update(entity: IQuizEntity, addQuestions: IQuestionEntity[], updateQuestions: IQuestionEntity[], deleteQuestionsIds: string[]): Promise<TQuizModelWithQuestions | null> {
		console.log(deleteQuestionsIds);
		try {
			return await this.prismaService.client.quizModel.update({
				where: { id: entity.id },
				data: {
					title: entity.title,
					questions: {
						update: updateQuestions.map((question) => ({
							where: { id: question.id, quizId: entity.id },
							data: this.questionMapper.toRepositoryUpdateFromEntity(question),
						})),
						createMany: {
							data: addQuestions.map((question) => this.questionMapper.toRepositoryCreateFromEntity(question)),
							skipDuplicates: true,
						},
						deleteMany: {
							id: {
								in: deleteQuestionsIds,
							},
						},
					},
				},
				include: {
					questions: true,
				},
			});
		} catch (err) {
			console.log(err);
			return null;
		}
	}

	async delete(id: string): Promise<[BatchPayload, TQuizModelWithQuestions] | null> {
		try {
			const deleteQuestions = this.prismaService.client.quizQuestionModel.deleteMany({
				where: { quizId: id },
			});

			const deleteQuiz = this.prismaService.client.quizModel.delete({
				where: { id },
				include: {
					questions: true,
				},
			});

			return await this.prismaService.client.$transaction([deleteQuestions, deleteQuiz]);
		} catch {
			return null;
		}
	}

	async getById(id: string): Promise<TQuizModelWithQuestions | null> {
		try {
			return await this.prismaService.client.quizModel.findUnique({
				where: { id },
				include: {
					questions: true,
				},
			});
		} catch {
			return null;
		}
	}

	async getByAuthor(id: string): Promise<QuizModel[] | null> {
		try {
			return await this.prismaService.client.quizModel.findMany({
				where: { authorId: id },
			});
		} catch {
			return null;
		}
	}
}
