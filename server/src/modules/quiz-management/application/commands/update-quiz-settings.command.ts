export interface UpdateQuizSettingsCommand {
	quizId: string;
	authorId: string;
	isRequiredEmail: boolean;
	isRequiredFirstName: boolean;
	isRequiredLastName: boolean;
	isShowAnswersAfterCompletion: boolean;
	availablePeriods?: {
		add?: Array<{ available_from: Date; available_to?: Date }>;
		update?: Array<{ id: number; available_from: Date; available_to?: Date }>;
		remove?: Array<number>;
	};
}
