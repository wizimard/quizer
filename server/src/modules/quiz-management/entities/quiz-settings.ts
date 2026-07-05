import type { QuizId } from './value-object/quiz-id';
import type { IQuizSettings, IQuizSettingsBase } from '../interfaces/quiz-settings.interface';
import type { IQuizAvailablePeriod } from '../interfaces/quiz-available-period.interface';
import { QuizAvailablePeriod } from './quiz-available-period';
import type { IQuizUpdateAvailablePeriodsData, IQuizUpdateSettingsData } from '../interfaces/repository/quiz.repository.interface';

export interface IPeriodChanges {
	add?: Array<{ available_from: Date; available_to?: Date }>;
	update?: Array<{ id: number; available_from: Date; available_to?: Date }>;
	remove?: Array<number>;
}

export class QuizSettings implements IQuizSettings {
	constructor(
		public readonly quizId: QuizId,
		public availablePeriods: Array<IQuizAvailablePeriod>,
		public isRequiredEmail: boolean,
		public isRequiredFirstName: boolean,
		public isRequiredLastName: boolean,
		public isShowAnswersAfterCompletion: boolean = false,
	) {}

	toObject(): IQuizSettingsBase {
		return {
			availablePeriods: this.availablePeriods.map((period) => period.toObject()),
			isRequiredEmail: this.isRequiredEmail,
			isRequiredFirstName: this.isRequiredFirstName,
			isRequiredLastName: this.isRequiredLastName,
			isShowAnswersAfterCompletion: this.isShowAnswersAfterCompletion,
		};
	}

	static buildUpdateData(data: IQuizUpdateSettingsData): IQuizUpdateSettingsData {
		return { ...data };
	}

	static buildAvailablePeriodsUpdateData(quizId: QuizId, periods: IPeriodChanges): IQuizUpdateAvailablePeriodsData {
		const updateData: IQuizUpdateAvailablePeriodsData = { availablePeriods: {} };

		if (periods.add?.length) {
			updateData.availablePeriods.add = periods.add.map((period) => new QuizAvailablePeriod(0, quizId.value, period.available_from, period.available_to));
		}

		if (periods.update?.length) {
			updateData.availablePeriods.update = periods.update.map((period) => new QuizAvailablePeriod(period.id, quizId.value, period.available_from, period.available_to));
		}

		if (periods.remove?.length) {
			updateData.availablePeriods.remove = periods.remove;
		}

		return updateData;
	}
}
