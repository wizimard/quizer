import type { TestId } from './value-object/test-id';
import type { TestSessionStartBy, TestSessionStatus } from '@prisma/client';

export class TestSessionEntity {
	public readonly id: string;
	public readonly testId: TestId;
	public readonly startedAt: Date;
	public readonly finishedAt: Date | null;
	public readonly status: TestSessionStatus;
	public readonly startBy: TestSessionStartBy;

	constructor(id: string, testId: TestId, startedAt: Date, finishedAt: Date | null, status: TestSessionStatus, startBy: TestSessionStartBy) {
		this.id = id;
		this.testId = testId;
		this.startedAt = startedAt;
		this.finishedAt = finishedAt;
		this.status = status;
		this.startBy = startBy;
	}
}
