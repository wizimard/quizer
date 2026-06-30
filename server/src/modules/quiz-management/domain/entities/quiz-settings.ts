import type { QuizId } from '../value-objects/quiz-id.vo';
import type { IQuizSettings, IQuizSettingsBase } from './quiz-settings.interface';
import type { IQuizAvailablePeriod } from './quiz-available-period.interface';
import { QuizAvailablePeriod } from './quiz-available-period';
import type { IQuizUpdateSettingsData } from '../repositories/quiz.repository.port';

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

	static buildUpdateData(
		quizId: QuizId,
		flags: Pick<IQuizUpdateSettingsData, 'isRequiredEmail' | 'isRequiredFirstName' | 'isRequiredLastName' | 'isShowAnswersAfterCompletion'>,
		periods?: IPeriodChanges,
	): IQuizUpdateSettingsData {
		const updateSettingsData: IQuizUpdateSettingsData = { ...flags };

		if (!periods) {
			return updateSettingsData;
		}

		updateSettingsData.availablePeriods = {};

		if (periods.add?.length) {
			updateSettingsData.availablePeriods.add = periods.add.map((period) => new QuizAvailablePeriod(0, quizId.value, period.available_from, period.available_to));
		}

		if (periods.update?.length) {
			updateSettingsData.availablePeriods.update = periods.update.map((period) => new QuizAvailablePeriod(period.id, quizId.value, period.available_from, period.available_to));
		}

		if (periods.remove?.length) {
			updateSettingsData.availablePeriods.remove = periods.remove;
		}

		return updateSettingsData;
	}
}
