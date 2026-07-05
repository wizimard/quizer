import type { UserId } from '@modules/identity-access';
import { QuizNotOwnedError } from '../utils/errors/quiz-not-owned.error';
import type { QuizId } from './value-object/quiz-id';
import type { QuestionEntity } from './question.entity';
import type { QuizSessionEntity } from './quiz-session.entity';
import type { IQuizSettings } from '../interfaces/quiz-settings.interface';

export class QuizEntity {
	constructor(
		public readonly id: QuizId,
		public title: string,
		public readonly authorId: UserId,
		public questions: Array<QuestionEntity>,
		public readonly settings: IQuizSettings | null,
		public readonly updatedAt: Date,
		public readonly createdAt: Date,
		public readonly sessions: Array<QuizSessionEntity> = [],
	) {}

	assertOwnedBy(userId: UserId): void {
		if (!this.authorId.equals(userId)) {
			throw new QuizNotOwnedError('QuizEntity.assertOwnedBy');
		}
	}

	updateTitle(title: string): void {
		this.title = title;
	}

	isOpen(): boolean {
		return (
			this.settings?.availablePeriods.some((period) => {
				const now = new Date();
				return now >= period.available_from && (!period.available_to || now <= period.available_to);
			}) || false
		);
	}
}
