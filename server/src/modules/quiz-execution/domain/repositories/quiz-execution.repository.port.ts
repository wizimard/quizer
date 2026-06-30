import type { QuizId } from '@modules/quiz-management/domain/value-objects/quiz-id.vo';
import type { ExecutableQuiz } from '../read-models/executable-quiz.read-model';

export interface QuizExecutionRepository {
	startQuiz(id: QuizId): Promise<ExecutableQuiz>;
	finishQuiz(id: QuizId): Promise<ExecutableQuiz>;
}
