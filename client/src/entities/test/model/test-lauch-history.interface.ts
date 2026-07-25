import type { TestLaunchResponseRunModeEnum } from "@shared/api/generated";

export interface TestLaunchHistory {
	testId: string;
	testTitle: string;
	sessionId: string;
	userRegisteredCount: number;
	runMode: TestLaunchResponseRunModeEnum;
	startedAt: Date;
	finishedAt: Date;
}
