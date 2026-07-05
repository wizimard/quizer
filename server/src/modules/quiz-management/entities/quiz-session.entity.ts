import type { QuizId } from './value-object/quiz-id';

export type QuizSessionStatus = 'ACTIVE' | 'FINISHED' | 'EXPIRED';

export class QuizSessionEntity {
	constructor(
		public readonly id: string,
		public readonly quizId: QuizId,
		public readonly startedAt: Date,
		public readonly finishedAt: Date | null,
		public readonly status: QuizSessionStatus,
	) {}
}
