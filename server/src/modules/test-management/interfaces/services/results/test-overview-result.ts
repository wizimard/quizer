import type { TestFullResult } from './test-full.result';
import type { QuestionResult } from './question.result';
import type { TestSessionRunMode } from '@prisma/client';

export interface TestOverviewAnswerResult {
	questionId: string;
	isCorrect: boolean;
	skipped: boolean;
	value: string;
}

export interface TestOverviewUserResult {
	id: string;
	firstName: string;
	lastName: string;
	answers: TestOverviewAnswerResult[];
	startedFrom: Date;
}

export interface TestOverviewResult extends TestFullResult {
	runMode: TestSessionRunMode;
	startedFrom: Date;
}

export interface TestExecutionFreeModeOverviewResult {
	test: TestOverviewResult;
	users: TestOverviewUserResult[];
	questions: QuestionResult[];
}

export interface TestExecutionManualModeOverviewResult extends TestExecutionFreeModeOverviewResult {
	currentQuestion: QuestionResult | null;
	currentQuestionIndex: number | null;
	totalQuestionsCount: number;
}

export type TestExecutionOverviewResult = TestExecutionFreeModeOverviewResult | TestExecutionManualModeOverviewResult;

export interface TestSessionOverviewResult {
	test: TestOverviewResult & { finishedAt: Date };
	users: TestOverviewUserResult[];
	questions: QuestionResult[];
}
