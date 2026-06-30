import type { QuizModelUpdateInput } from '@prisma/models';
import type { QuestionEntity } from '../../../domain/entities/question.entity';
import type { QuizEntity } from '../../../domain/entities/quiz.entity';
import type { IQuizUpdateSettingsData } from '../../../domain/repositories/quiz.repository.port';
import { QuestionMapper } from './question.mapper';

export const QuizPersistenceMapper = {
	toCreateData(entity: QuizEntity) {
		return {
			title: entity.title,
			authorId: entity.authorId.value,
			questions: {
				create: entity.questions.map((question) => QuestionMapper.toPersistence(question)),
			},
			quizSettings: {
				create: {
					availablePeriods: {
						create: [],
					},
				},
			},
		};
	},

	toUpdateData(entity: QuizEntity, addQuestions: QuestionEntity[], updateQuestions: QuestionEntity[], deleteQuestionsIds: string[]) {
		return {
			title: entity.title,
			questions: {
				update: updateQuestions.map((question) => ({
					where: { id: question.id, quizId: entity.id.value },
					data: QuestionMapper.toPersistence(question),
				})),
				createMany: {
					data: addQuestions.map((question) => QuestionMapper.toPersistence(question)),
					skipDuplicates: true,
				},
				deleteMany: {
					id: {
						in: deleteQuestionsIds,
					},
				},
			},
		};
	},

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
	},
};
