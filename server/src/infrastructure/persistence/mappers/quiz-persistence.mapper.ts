import { inject, injectable } from 'inversify';
import type { QuizModelUpdateInput } from '@prisma/models';
import type { IQuizEntity } from '@domain/quiz/quiz.entity.interface';
import type { IQuestionEntity } from '@domain/quiz/question.entity.interface';
import type { IQuizUpdateSettingsData } from '@domain/quiz/ports/quiz.repository.port';
import { QuestionMapper } from './question.mapper';
import { QUIZ_TYPES } from '@composition/quiz.types';

@injectable()
export class QuizPersistenceMapper {
	constructor(@inject(QUIZ_TYPES.QUESTION_MAPPER) private readonly questionMapper: QuestionMapper) {}

	toCreateData(entity: IQuizEntity) {
		return {
			title: entity.title,
			authorId: entity.authorId,
			questions: {
				create: entity.questions.map((question) => this.questionMapper.toPersistence(question)),
			},
			quizSettings: {
				create: {
					availablePeriods: {
						create: [],
					},
				},
			},
		};
	}

	toUpdateData(entity: IQuizEntity, addQuestions: IQuestionEntity[], updateQuestions: IQuestionEntity[], deleteQuestionsIds: string[]) {
		return {
			title: entity.title,
			questions: {
				update: updateQuestions.map((question) => ({
					where: { id: question.id, quizId: entity.id },
					data: this.questionMapper.toPersistence(question),
				})),
				createMany: {
					data: addQuestions.map((question) => this.questionMapper.toPersistence(question)),
					skipDuplicates: true,
				},
				deleteMany: {
					id: {
						in: deleteQuestionsIds,
					},
				},
			},
		};
	}

	toSettingsUpdateInput(updateSettingsData: IQuizUpdateSettingsData): QuizModelUpdateInput {
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

		return updateData;
	}
}
