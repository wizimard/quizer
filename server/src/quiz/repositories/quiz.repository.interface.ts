import type { QuizModel, QuizSettingsModel } from '@prisma/client';
import type { QuizModelGetPayload, QuizSettingsModelGetPayload } from '@prisma/models';
import type { IQuizEntity } from '../entities/quiz.entity.interface';
import type { IQuestionEntity } from '../entities/question.entity.interface';
import type { IQuizAvailablePeriod } from '../entities/quiz-available-period.interface';

export type TQuizSettingsModelAll = QuizSettingsModel &
	QuizSettingsModelGetPayload<{ select: { availablePeriods: true; isShowAnswersAfterCompletion: true; isRequiredEmail: true; isRequiredFirstName: true; isRequiredLastName: true } }>;

export type TQuizModelWithQuestions = QuizModel & QuizModelGetPayload<{ select: { questions: true } }>;

export type TQuizModelAll = QuizModel &
	QuizModelGetPayload<{
		select: {
			questions: true;
			quizSettings: { select: { availablePeriods: true; isShowAnswersAfterCompletion: true; isRequiredEmail: true; isRequiredFirstName: true; isRequiredLastName: true } };
		};
	}>;

export interface IQuizUpdateSettingsData {
	availablePeriods?: {
		add?: Array<IQuizAvailablePeriod>;
		update?: Array<IQuizAvailablePeriod>;
		remove?: Array<number>;
	};
	isRequiredEmail: boolean;
	isRequiredFirstName: boolean;
	isRequiredLastName: boolean;
	isShowAnswersAfterCompletion: boolean;
}

export interface IQuizRepository {
	create(data: IQuizEntity): Promise<TQuizModelAll | null>;
	update(data: IQuizEntity, addQuestions: Array<IQuestionEntity>, updateQuestions: Array<IQuestionEntity>, deleteQuestionsIds: Array<string>): Promise<TQuizModelAll | null>;
	delete(id: string): Promise<QuizModel | null>;
	getFullById(id: string): Promise<TQuizModelAll | null>;
	getById(id: string): Promise<QuizModel | null>;
	getByAuthor(id: string): Promise<Array<QuizModel> | null>;
	updateSettings(quizId: string, updateSettingsData: IQuizUpdateSettingsData): Promise<TQuizModelAll | null>;
}
