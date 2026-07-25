import type { TestSessionModel, TestSessionRunMode } from '@prisma/client';

export interface TestSessionRepository {
	startTest(testId: string, runMode: TestSessionRunMode, finishedAt?: Date): Promise<TestSessionModel | null>;
	finishTest(testId: string): Promise<number>;
	nextQuestion(testId: string, questionId: string): Promise<TestSessionModel | null>;
}
