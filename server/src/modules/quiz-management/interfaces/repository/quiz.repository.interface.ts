import type { UserId } from '@modules/identity-access';
import type { QuizEntity } from '../../entities/quiz.entity';
import type { IQuizAvailablePeriod } from '../quiz-available-period.interface';
import type { QuizId } from '../../entities/value-object/quiz-id';
import type { QuizModel, QuizSettingsModel } from '@prisma/client';
import type { QuizModelGetPayload, QuizSettingsModelGetPayload } from '@prisma/models';

export type TQuizSettingsModelAll = QuizSettingsModel &
	QuizSettingsModelGetPayload<{ select: { availablePeriods: true; isShowAnswersAfterCompletion: true; isRequiredEmail: true; isRequiredFirstName: true; isRequiredLastName: true } }>;

export type TQuizModelWithQuestions = QuizModel & QuizModelGetPayload<{ select: { questions: true } }>;

export type TQuizModelAll = QuizModel &
	QuizModelGetPayload<{
		select: {
			questions: true;
			quizSettings: { select: { availablePeriods: true; isShowAnswersAfterCompletion: true; isRequiredEmail: true; isRequiredFirstName: true; isRequiredLastName: true } };
			quizSessions: true;
		};
	}>;

export type TQuizModelWithSessions = QuizModel & QuizModelGetPayload<{ select: { quizSessions: true } }>;

export interface IQuizUpdateSettingsData {
	title: string;
	isRequiredEmail: boolean;
	isRequiredFirstName: boolean;
	isRequiredLastName: boolean;
	isShowAnswersAfterCompletion: boolean;
}

export interface IQuizUpdateAvailablePeriodsData {
	availablePeriods: {
		add?: Array<IQuizAvailablePeriod>;
		update?: Array<IQuizAvailablePeriod>;
		remove?: Array<number>;
	};
}

export interface QuizRepository {
	create(data: QuizEntity): Promise<QuizEntity>;
	update(data: QuizEntity): Promise<QuizEntity>;
	delete(id: QuizId): Promise<boolean>;
	findById(id: QuizId): Promise<QuizEntity | null>;
	findFullById(id: QuizId): Promise<QuizEntity | null>;
	findByAuthor(authorId: UserId): Promise<QuizEntity[]>;
	updateSettings(quizId: QuizId, updateSettingsData: IQuizUpdateSettingsData): Promise<QuizEntity>;
	updateAvailablePeriods(quizId: QuizId, updateData: IQuizUpdateAvailablePeriodsData): Promise<QuizEntity>;
}
