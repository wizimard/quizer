import { UserId } from '@modules/identity-access';
import { TestNotOwnedError } from '../utils/errors/test-not-owned.error';
import { TestId } from './value-object/test-id';
import type { TestSessionEntity } from './test-session.entity';
import type { ITestSettings } from '../interfaces/entities/test-settings.interface';
import type { ITestSchedulerPeriod } from '../interfaces/entities/test-scheduler-period.interface';
import type { QuestionEntity } from '..';

export type TestStatus = 'open' | 'open_by_scheduler' | 'closed';

export class TestEntity {
	public status: TestStatus;

	public readonly id: TestId;
	public readonly authorId: UserId;
	public title: string;
	public questions: Array<QuestionEntity>;
	public settings: ITestSettings | null;
	public schedulerPeriods: Array<ITestSchedulerPeriod>;
	public updatedAt: Date;
	public createdAt: Date;
	public sessions: Array<TestSessionEntity> = [];

	constructor(
		id: TestId,
		authorId: UserId,
		title: string,
		questions: Array<QuestionEntity>,
		settings: ITestSettings | null,
		schedulerPeriods: Array<ITestSchedulerPeriod>,
		sessions: Array<TestSessionEntity>,
		updatedAt: Date,
		createdAt: Date,
	) {
		this.id = id;
		this.authorId = authorId;
		this.title = title;

		this.questions = questions;
		this.settings = settings;
		this.schedulerPeriods = schedulerPeriods;
		this.sessions = sessions;

		this.createdAt = createdAt;
		this.updatedAt = updatedAt;

		this.setStatus();
	}

	get availablePeriods(): Array<ITestSchedulerPeriod> {
		return this.schedulerPeriods;
	}

	get isOpen(): boolean {
		return this.status === 'open' || this.status === 'open_by_scheduler';
	}

	private setStatus(): void {
		if (this.sessions.length > 0) {
			if (this.sessions[0]!.status === 'ACTIVE') {
				this.status = this.sessions[0]!.startBy === 'SCHEDULED' ? 'open_by_scheduler' : 'open';
			}
			return;
		}
	}

	assertOwnedBy(userId: UserId): void {
		if (!this.authorId.equals(userId)) {
			throw new TestNotOwnedError('TestEntity.assertOwnedBy');
		}
	}
}
