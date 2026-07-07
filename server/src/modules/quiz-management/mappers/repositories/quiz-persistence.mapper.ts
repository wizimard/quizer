import type { QuizModelUpdateInput } from '@prisma/models';
import type { QuizEntity } from '../../entities/quiz.entity';
import type { IQuizUpdateAvailablePeriodsData, IQuizUpdateSettingsData } from '../../interfaces/repository/quiz.repository.interface';

export const QuizPersistenceMapper = {
	toCreateData(entity: QuizEntity) {
		return {
			title: entity.title,
			authorId: entity.authorId.value,
			quizSettings: {
				create: {
					availablePeriods: {
						create: [],
					},
				},
			},
		};
	},

	toUpdateData(entity: QuizEntity): QuizModelUpdateInput {
		return {
			title: entity.title,
		};
	},

	toSettingsUpdateInput(updateSettingsData: IQuizUpdateSettingsData): QuizModelUpdateInput {
		return {
			title: updateSettingsData.title,
			quizSettings: {
				update: {
					isShowAnswersAfterCompletion: updateSettingsData.isShowAnswersAfterCompletion,
					isRequiredEmail: updateSettingsData.isRequiredEmail,
					isRequiredFirstName: updateSettingsData.isRequiredFirstName,
					isRequiredLastName: updateSettingsData.isRequiredLastName,
				},
			},
		};
	},

	toAvailablePeriodsUpdateInput(updateData: IQuizUpdateAvailablePeriodsData): QuizModelUpdateInput {
		const { add: addPeriods, update: updatePeriods, remove: deletePeriods } = updateData.availablePeriods;
		const updateInput: QuizModelUpdateInput = {
			quizSettings: {
				update: {
					availablePeriods: {},
				},
			},
		};

		if (addPeriods?.length) {
			updateInput.quizSettings!.update!.availablePeriods!.createMany = {
				data: addPeriods.map((period) => ({
					available_from: period.available_from,
					available_to: period.available_to ?? null,
				})),
			};
		}

		if (updatePeriods?.length) {
			updateInput.quizSettings!.update!.availablePeriods!.update = updatePeriods.map((period) => ({
				where: { id: period.id },
				data: { available_from: period.available_from, available_to: period.available_to ?? null },
			}));
		}

		if (deletePeriods?.length) {
			updateInput.quizSettings!.update!.availablePeriods!.deleteMany = {
				id: {
					in: deletePeriods,
				},
			};
		}

		return updateInput;
	},

	toAvailablePeriodsCloseInput({ periodId }: { periodId: number }): QuizModelUpdateInput {
		return {
			quizSettings: {
				update: {
					availablePeriods: { update: { where: { id: periodId }, data: { status: 'MANUALLY_CLOSED' } } },
				},
			},
		};
	},
};
