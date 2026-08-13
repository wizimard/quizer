import type { TestSessionModel, TestSessionRunMode } from '@prisma/client';
import type { TestSessionModelGetPayload } from '@prisma/models';

export type TestSessionHistoryModel = TestSessionModel & TestSessionModelGetPayload<{ select: { test: true; _count: { select: { registered_users: true } } } }>;

export interface TestSessionRepository {
	startTest(testId: string, runMode: TestSessionRunMode, finishedAt?: Date): Promise<TestSessionModel | null>;
	finishTest(testId: string): Promise<TestSessionModel | null>;
	finishExpiredTests(): Promise<TestSessionModel[]>;
	findActiveWithDeadline(): Promise<TestSessionModel[]>;
	nextQuestion(testId: string, questionId: string): Promise<TestSessionModel | null>;
	getTestHistory(testId: string): Promise<Array<TestSessionHistoryModel> | null>;
	findById(sessionId: string, testId: string): Promise<TestSessionModel | null>;
	getTestsHistory(authorId: string): Promise<Array<TestSessionHistoryModel> | null>;
}
