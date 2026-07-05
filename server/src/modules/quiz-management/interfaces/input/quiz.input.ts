import type { QuizEntity } from '../../entities/quiz.entity';

export interface CreateQuizInput {
	title: string;
	authorId: string;
}

export interface UpdateQuizInput {
	id: string;
	authorId: string;
	title?: string;
}

export interface DeleteQuizInput {
	quizId: string;
	authorId: string;
}

export interface UpdateQuizSettingsInput {
	quiz: QuizEntity;
	title: string;
	isRequiredEmail: boolean;
	isRequiredFirstName: boolean;
	isRequiredLastName: boolean;
	isShowAnswersAfterCompletion: boolean;
}

export interface UpdateQuizAvailablePeriodsInput {
	quiz: QuizEntity;
	availablePeriods: {
		add?: Array<{ available_from: Date; available_to?: Date }>;
		update?: Array<{ id: number; available_from: Date; available_to?: Date }>;
		remove?: Array<number>;
	};
}

export interface GetQuizByIdInput {
	quizId: string;
	userId: string;
}

export interface GetQuizzesByAuthorInput {
	authorId: string;
}
