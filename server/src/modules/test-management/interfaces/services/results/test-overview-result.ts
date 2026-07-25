import type { TestFullResult } from './test-full.result';
import type { QuestionResult } from './question.result';
import type { TestSessionRunMode } from '@prisma/client';

export interface TestExecutionOverviewAnswerResult {
	questionId: string;
	isCorrect: boolean;
	skipped: boolean;
	value: string;
}

export interface TestExecutionOverviewUserResult {
	id: string;
	firstName: string;
	lastName: string;
	answers: TestExecutionOverviewAnswerResult[];
	startedFrom: Date;
}

export interface TestExecutionOverview extends TestFullResult {
	runMode: TestSessionRunMode;
	startedFrom: Date;
}

export interface TestExecutionFreeModeOverviewResult {
	test: TestExecutionOverview;
	users: TestExecutionOverviewUserResult[];
	questions: QuestionResult[];
}

export interface TestExecutionManualModeOverviewResult extends TestExecutionFreeModeOverviewResult {
	currentQuestion: QuestionResult | null;
	currentQuestionIndex: number | null;
	totalQuestionsCount: number;
}

export type TestExecutionOverviewResult = TestExecutionFreeModeOverviewResult | TestExecutionManualModeOverviewResult;
