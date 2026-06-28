import type { QuizAvailablePeriodBase, QuizResponse, QuizSettingsBase } from "@shared/api/generated";

export type TQuizAvailablePeriod = Pick<QuizAvailablePeriodBase, "id" | "quizId"> & {
	available_from: Date;
	available_to: Date | null;
};

export type TQuizSettings = Pick<QuizSettingsBase, "isRequiredEmail" | "isRequiredFirstName" | "isRequiredLastName" | "isShowAnswersAfterCompletion"> & {
	availablePeriods: Array<TQuizAvailablePeriod>;
};

export type TQuiz = Omit<QuizResponse, "settings"> & {
	settings: TQuizSettings;
};
