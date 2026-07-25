import { TestNotOwnedError } from '../utils/errors/test-not-owned.error';
import type { TestSessionEntity } from './test-session.entity';
import type { QuestionEntity } from '..';
import type { TestSettings } from './test-settings';
import type { TestSchedulerPeriod } from './test-scheduler-period';

export type TestStatus = 'open' | 'open_by_scheduler' | 'closed' | 'finished';

export class TestEntity {
	public status: TestStatus = 'closed';

	public readonly id: string;
	public readonly authorId: string;
	public title: string;

	public questions: Array<QuestionEntity> = [];
	public settings: TestSettings | null = null;
	public schedulerPeriods: Array<TestSchedulerPeriod> = [];
	public _sessions: Array<TestSessionEntity> = [];

	public updatedAt: Date;
	public createdAt: Date;

	constructor(id: string, authorId: string, title: string, updatedAt: Date, createdAt: Date) {
		this.id = id;
		this.authorId = authorId;
		this.title = title;
		this.updatedAt = updatedAt;
		this.createdAt = createdAt;
	}

	get isOpen(): boolean {
		return this.status === 'open' || this.status === 'open_by_scheduler';
	}

	get sessions(): Array<TestSessionEntity> {
		return this._sessions;
	}

	public setSessions(sessions: Array<TestSessionEntity>): void {
		this._sessions = sessions;

		if (!sessions.length) {
			this.status = 'closed';
			return;
		}

		if (sessions[0]!.status === 'ACTIVE') {
			this.status = sessions[0]!.startBy === 'SCHEDULED' ? 'open_by_scheduler' : 'open';

			return;
		}

		const hourInterval = 60 * 60 * 1000;

		this.status = Date.now() - sessions[0]!.startedAt.getTime() > hourInterval ? 'finished' : 'closed';
	}

	assertOwnedBy(userId: string): void {
		if (this.authorId !== userId) {
			throw new TestNotOwnedError('TestEntity.assertOwnedBy');
		}
	}
}
