import type { UserId } from '@modules/identity-access';
import { TestNotOwnedError } from '../utils/errors/test-not-owned.error';
import type { TestId } from './value-object/test-id';
import type { TestSessionEntity } from './test-session.entity';
import type { ITestSettings } from '../interfaces/test-settings.interface';
import type { ITestSchedulerPeriod } from '../interfaces/test-scheduler-period.interface';
import type { QuestionEntity } from '..';
import type { TestSessionStatus } from '@prisma/client';

export class TestEntity {
	public status: TestSessionStatus;

	constructor(
		public readonly id: TestId,
		public title: string,
		public readonly authorId: UserId,
		public questions: Array<QuestionEntity>,
		public readonly settings: ITestSettings | null,
		public readonly schedulerPeriods: Array<ITestSchedulerPeriod>,
		public readonly updatedAt: Date,
		public readonly createdAt: Date,
		public readonly sessions: Array<TestSessionEntity> = [],
	) {
		this.setStatus();
	}

	get availablePeriods(): Array<ITestSchedulerPeriod> {
		return this.schedulerPeriods;
	}

	get isOpen(): boolean {
		return this.status === 'ACTIVE';
	}

	private setStatus(): void {
		if (this.sessions.length > 0) {
			this.status = this.sessions[0]!.status;
			return;
		}
	}

	assertOwnedBy(userId: UserId): void {
		if (!this.authorId.equals(userId)) {
			throw new TestNotOwnedError('TestEntity.assertOwnedBy');
		}
	}

	updateTitle(title: string): void {
		this.title = title;
	}
}
