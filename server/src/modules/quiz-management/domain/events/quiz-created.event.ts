import type { UserId } from '@modules/identity-access/domain/value-objects/user-id.vo';
import type { QuizId } from '../value-objects/quiz-id.vo';

export class QuizCreatedEvent {
	readonly occurredAt: Date;

	constructor(
		public readonly quizId: QuizId,
		public readonly authorId: UserId,
		public readonly title: string,
	) {
		this.occurredAt = new Date();
	}
}
