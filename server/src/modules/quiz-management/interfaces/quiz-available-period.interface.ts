import type { QuizAvailablePeriodStatus } from '@prisma/client';

export interface IQuizAvailablePeriodBase {
	id: number;
	quizSettingsId: string;
	available_from: Date;
	available_to?: Date | undefined | null;
	status: QuizAvailablePeriodStatus;
}

export interface IQuizAvailablePeriod extends IQuizAvailablePeriodBase {
	toObject(): IQuizAvailablePeriodBase;
}
