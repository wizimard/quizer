import { APP_TYPES } from '@app_types';
import { inject, injectable } from 'inversify';
import type { PrismaService } from '@database';
import type { IQuizRepository, IQuizUpdateSettingsData, TQuizModelAll } from './quiz.repository.interface';
import type { QuizModel } from '@prisma/client';
import type { IQuizEntity } from '../entities/quiz.entity.interface';
import type { IQuestionEntity } from '../entities/question.entity.interface';
import { QuestionMapper } from '../mappers/question.mapper';
import type { QuizModelUpdateInput } from '@prisma/models';

@injectable()
export class QuizRepository implements IQuizRepository {
	private readonly questionMapper: QuestionMapper = new QuestionMapper();

	constructor(@inject(APP_TYPES.PRISMA) private readonly prismaService: PrismaService) {}

	async create(entity: IQuizEntity): Promise<TQuizModelAll | null> {
		try {
			return await this.prismaService.client.quizModel.create({
				data: {
					title: entity.title,
					authorId: entity.authorId,
					questions: {
						create: entity.questions.map((question) => this.questionMapper.toRepositoryUpdateFromEntity(question)),
					},
					quizSettings: {
						create: {
							availablePeriods: {
								create: [],
							},
						},
					},
				},
				include: {
					questions: true,
					quizSettings: {
						include: {
							availablePeriods: true,
						},
					},
				},
			});
		} catch {
			return null;
		}
	}

	async update(entity: IQuizEntity, addQuestions: IQuestionEntity[], updateQuestions: IQuestionEntity[], deleteQuestionsIds: string[]): Promise<TQuizModelAll | null> {
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
					quizSettings: {
						include: {
							availablePeriods: true,
						},
					},
				},
			});
		} catch (err) {
			console.log(err);
			return null;
		}
	}

	async delete(id: string): Promise<QuizModel | null> {
		try {
			return await this.prismaService.client.quizModel.delete({
				where: { id },
			});
		} catch {
			return null;
		}
	}

	async getById(id: string): Promise<QuizModel | null> {
		try {
			return await this.prismaService.client.quizModel.findUnique({
				where: { id },
			});
		} catch {
			return null;
		}
	}

	async getFullById(id: string): Promise<TQuizModelAll | null> {
		try {
			return await this.prismaService.client.quizModel.findUnique({
				where: { id },
				include: {
					questions: true,
					quizSettings: {
						include: {
							availablePeriods: true,
						},
					},
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
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async updateSettings(quizId: string, updateSettingsData: IQuizUpdateSettingsData): Promise<TQuizModelAll | null> {
		try {
			const updateData: QuizModelUpdateInput = {};

			const { add: addPeriods, update: updatePeriods, remove: deletePeriods } = updateSettingsData.availablePeriods ?? {};

			updateData.quizSettings = {
				update: {
					isShowAnswersAfterCompletion: updateSettingsData.isShowAnswersAfterCompletion,
					isRequiredEmail: updateSettingsData.isRequiredEmail,
					isRequiredFirstName: updateSettingsData.isRequiredFirstName,
					isRequiredLastName: updateSettingsData.isRequiredLastName,
				},
			};

			if (updateSettingsData.availablePeriods) {
				updateData.quizSettings.update!.availablePeriods = {};
			}

			if (addPeriods?.length) {
				updateData.quizSettings!.update!.availablePeriods!.createMany = {
					data: addPeriods.map((period) => ({
						available_from: period.available_from,
						available_to: period.available_to ?? null,
					})),
				};
			}
			if (updatePeriods?.length) {
				updateData.quizSettings!.update!.availablePeriods!.update = updatePeriods.map((period) => ({
					where: { id: period.id },
					data: { available_from: period.available_from, available_to: period.available_to ?? null },
				}));
			}
			if (deletePeriods?.length) {
				updateData.quizSettings!.update!.availablePeriods!.deleteMany = {
					id: {
						in: deletePeriods,
					},
				};
			}

			return await this.prismaService.client.quizModel.update({
				where: {
					id: quizId,
				},
				data: updateData,
				include: {
					questions: true,
					quizSettings: {
						include: {
							availablePeriods: true,
						},
					},
				},
			});
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}
