import type { IQuizAvailablePeriod, IQuizAvailablePeriodBase } from './quiz-available-period.interface';

export interface IQuizSettingsBase {
	availablePeriods: Array<IQuizAvailablePeriodBase>;
	isRequiredEmail: boolean;
	isRequiredFirstName: boolean;
	isRequiredLastName: boolean;
	isShowAnswersAfterCompletion: boolean;
}

export interface IQuizSettings extends IQuizSettingsBase {
	availablePeriods: Array<IQuizAvailablePeriod>;

	toObject(): IQuizSettingsBase;
}
