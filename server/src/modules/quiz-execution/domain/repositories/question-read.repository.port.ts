import type { QuizId } from '@modules/quiz-management/domain/value-objects/quiz-id.vo';
import type { QuestionReadModel } from '../read-models/question-read.model';

export interface QuestionReadRepository {
	findById(quizId: QuizId, questionId: string): Promise<QuestionReadModel | null>;
}
