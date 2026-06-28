import type { IQuizSettings, IQuizSettingsBase } from './quiz-settings.interface';
import type { IQuizAvailablePeriod } from './quiz-available-period.interface';

export class QuizSettings implements IQuizSettings {
	constructor(
		public readonly quizId: string,
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
}
