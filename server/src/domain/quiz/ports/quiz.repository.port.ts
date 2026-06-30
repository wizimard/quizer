import type { IQuizEntity } from '../quiz.entity.interface';
import type { IQuestionEntity } from '../question.entity.interface';
import type { IQuizAvailablePeriod } from '../quiz-available-period.interface';
import type { QuizModel } from '@prisma/client';

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

export interface QuizRepository {
	create(data: IQuizEntity): Promise<IQuizEntity>;
	update(data: IQuizEntity, addQuestions: Array<IQuestionEntity>, updateQuestions: Array<IQuestionEntity>, deleteQuestionsIds: Array<string>): Promise<IQuizEntity>;
	delete(id: string): Promise<void>;
	findById(id: string): Promise<IQuizEntity | null>;
	findFullById(id: string): Promise<IQuizEntity | null>;
	findByAuthor(authorId: string): Promise<IQuizEntity[]>;
	updateSettings(quizId: string, updateSettingsData: IQuizUpdateSettingsData): Promise<IQuizEntity>;

	startQuiz(quizId: string): Promise<QuizModel>;
	finishQuiz(quizId: string): Promise<QuizModel>;
}
