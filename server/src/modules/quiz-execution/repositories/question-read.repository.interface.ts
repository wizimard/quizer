import type { QuizId } from '@modules/quiz-management/entities/value-object/quiz-id';
import type { QuestionReadModel } from '../entities/question-read.model';

export interface QuestionReadRepository {
	findById(quizId: QuizId, questionId: string): Promise<QuestionReadModel | null>;
}
