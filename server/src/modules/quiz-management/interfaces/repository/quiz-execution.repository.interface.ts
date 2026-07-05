import type { QuizId } from '../../entities/value-object/quiz-id';
import type { ExecutableQuiz } from '../../entities/executable-quiz';
import type { UserId } from '@modules/identity-access';

export interface QuizExecutionRepository {
	startQuiz(id: QuizId, userId: UserId, finishedAt?: Date): Promise<ExecutableQuiz>;
	finishQuiz(id: QuizId, userId: UserId): Promise<ExecutableQuiz>;
}
