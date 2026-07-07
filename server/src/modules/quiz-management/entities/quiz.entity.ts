import type { UserId } from '@modules/identity-access';
import { QuizNotOwnedError } from '../utils/errors/quiz-not-owned.error';
import type { QuizId } from './value-object/quiz-id';
import type { QuizSessionEntity } from './quiz-session.entity';
import type { IQuizSettings } from '../interfaces/quiz-settings.interface';
import type { TQuizStatus } from '../interfaces/http/quiz-response.interface';
import type { IQuizAvailablePeriod } from '../interfaces/quiz-available-period.interface';
import type { QuestionEntity } from '..';

export class QuizEntity {
	public status: TQuizStatus;

	constructor(
		public readonly id: QuizId,
		public title: string,
		public readonly authorId: UserId,
		public questions: Array<QuestionEntity>,
		public readonly settings: IQuizSettings | null,
		public readonly updatedAt: Date,
		public readonly createdAt: Date,
		public readonly sessions: Array<QuizSessionEntity> = [],
	) {
		this.setStatus();
	}

	get availablePeriods(): Array<IQuizAvailablePeriod> {
		return this.settings?.availablePeriods || [];
	}

	private setStatus(): void {
		if (this.sessions.length > 0) {
			this.status = 'manual_open';
			return;
		}

		const now = new Date();

		const { current, future } = this.availablePeriods.reduce(
			(acc, period) => {
				if (period.available_from <= now && (!period.available_to || period.available_to >= now) && period.status !== 'MANUALLY_CLOSED') {
					acc.current.push(period);
				} else if (period.available_from > now) {
					acc.future.push(period);
				}
				return acc;
			},
			{ current: [] as Array<IQuizAvailablePeriod>, future: [] as Array<IQuizAvailablePeriod> },
		);

		if (current.length > 0) {
			this.status = 'open_by_scheduler';
			return;
		}

		if (future.length > 0) {
			this.status = 'scheduler';
			return;
		}

		this.status = 'closed';
	}

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
