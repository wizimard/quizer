import { HttpError } from '@error';
import { injectable } from 'inversify';
import type { IQuizOwnershipPolicy } from './quiz-ownership.policy.interface';

@injectable()
export class QuizOwnershipPolicy implements IQuizOwnershipPolicy {
	assertOwner(quiz: { authorId: string }, userId: string): void {
		if (quiz.authorId !== userId) {
			throw new HttpError(403, 'quiz_not_author', 'QuizOwnershipPolicy');
		}
	}
}
