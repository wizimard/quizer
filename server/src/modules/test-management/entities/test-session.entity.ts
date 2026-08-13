import type { TestSessionRunMode, TestSessionStartBy, TestSessionStatus } from '@prisma/client';

export class TestSessionEntity {
	public readonly id: string;
	public readonly testId: string;
	public readonly startedAt: Date;
	public readonly finishedAt: Date | null;
	public readonly status: TestSessionStatus;
	public readonly startBy: TestSessionStartBy;
	public readonly runMode: TestSessionRunMode;

	public currentQuestionId: string | null;

	constructor(
		id: string,
		testId: string,
		status: TestSessionStatus,
		runMode: TestSessionRunMode,
		startedAt: Date,
		finishedAt: Date | null,
		startBy: TestSessionStartBy,
		currentQuestionId: string | null,
	) {
		this.id = id;
		this.testId = testId;
		this.startedAt = startedAt;
		this.finishedAt = finishedAt;
		this.status = status;
		this.startBy = startBy;
		this.runMode = runMode;
		this.currentQuestionId = currentQuestionId;
	}
}
