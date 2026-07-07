import type { QuestionEntity } from '../../entities/question.entity';
import type { QuestionId } from '../../entities/value-object/question-id';
import type { QuizId } from '../../entities/value-object/quiz-id';

export interface QuestionRepository {
	create(data: QuestionEntity): Promise<QuestionEntity>;
	update(data: QuestionEntity): Promise<QuestionEntity>;
	delete(id: QuestionId, quizId: QuizId): Promise<boolean>;
	findById(id: QuestionId): Promise<QuestionEntity | null>;
	findByQuizId(quizId: QuizId): Promise<QuestionEntity[]>;
	updateQuestionsOrders(questions: QuestionEntity[]): Promise<boolean>;
}
