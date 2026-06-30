export interface QuizAvailablePeriodDto {
	id: number;
	quizSettingsId: string;
	available_from: Date;
	available_to?: Date | null;
}

export interface QuizSettingsDto {
	availablePeriods: QuizAvailablePeriodDto[];
	isRequiredEmail: boolean;
	isRequiredFirstName: boolean;
	isRequiredLastName: boolean;
	isShowAnswersAfterCompletion: boolean;
}
