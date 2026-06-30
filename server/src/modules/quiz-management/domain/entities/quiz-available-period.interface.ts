export interface IQuizAvailablePeriodBase {
	id: number;
	quizSettingsId: string;
	available_from: Date;
	available_to?: Date | undefined | null;
}

export interface IQuizAvailablePeriod extends IQuizAvailablePeriodBase {
	toObject(): IQuizAvailablePeriodBase;
}
