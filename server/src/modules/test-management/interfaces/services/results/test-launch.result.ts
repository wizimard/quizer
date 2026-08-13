import type { TestSessionRunMode } from '@prisma/enums';

export interface TestLaunchResult {
	testId: string;
	testTitle: string;
	sessionId: string;
	runMode: TestSessionRunMode;
	userRegisteredCount: number;
	startedAt: Date;
	finishedAt: Date;
}
