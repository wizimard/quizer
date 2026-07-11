import type { TestSessionModel } from '@prisma/client';

export interface TestExecutionRepository {
	startTest(testId: string, finishedAt?: Date): Promise<TestSessionModel | null>;
	finishTest(testId: string): Promise<number>;
}
