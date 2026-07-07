import type { QuizAvailablePeriodStatus } from '@prisma/client';

export interface QuizAvailablePeriodDto {
	id: number;
	quizSettingsId: string;
	available_from: Date;
	available_to?: Date | null;
	status: QuizAvailablePeriodStatus;
}

export interface QuizSettingsDto {
	availablePeriods: QuizAvailablePeriodDto[];
	isRequiredEmail: boolean;
	isRequiredFirstName: boolean;
	isRequiredLastName: boolean;
	isShowAnswersAfterCompletion: boolean;
}
