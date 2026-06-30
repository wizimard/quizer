import type { UserId } from '@modules/identity-access/domain/value-objects/user-id.vo';
import { QuizNotOwnedError } from '../errors/quiz-not-owned.error';

export class QuizOwnershipPolicy {
	assertOwner(quiz: { authorId: UserId }, userId: UserId): void {
		if (!quiz.authorId.equals(userId)) {
			throw new QuizNotOwnedError();
		}
	}
}
