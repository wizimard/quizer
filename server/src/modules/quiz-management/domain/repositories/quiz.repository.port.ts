import type { UserId } from '@modules/identity-access/domain/value-objects/user-id.vo';
import type { QuestionEntity } from '../entities/question.entity';
import type { QuizEntity } from '../entities/quiz.entity';
import type { IQuizAvailablePeriod } from '../entities/quiz-available-period.interface';
import type { QuizId } from '../value-objects/quiz-id.vo';

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
	create(data: QuizEntity): Promise<QuizEntity>;
	update(data: QuizEntity, addQuestions: Array<QuestionEntity>, updateQuestions: Array<QuestionEntity>, deleteQuestionsIds: Array<string>): Promise<QuizEntity>;
	delete(id: QuizId): Promise<void>;
	findById(id: QuizId): Promise<QuizEntity | null>;
	findFullById(id: QuizId): Promise<QuizEntity | null>;
	findByAuthor(authorId: UserId): Promise<QuizEntity[]>;
	updateSettings(quizId: QuizId, updateSettingsData: IQuizUpdateSettingsData): Promise<QuizEntity>;
}
