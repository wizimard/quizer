import type { FinishTestInput } from './input/finish-test.input';
import type { StartTestInput } from './input/start-test.input';
import type { NextQuestionInput } from './input/next-question.input';
import type { TestExecutionOverviewResult } from './results/test-overview-result';

export interface TestSessionService {
	startTest(input: StartTestInput): Promise<boolean>;
	finishTest(input: FinishTestInput): Promise<boolean>;
	nextQuestion(input: NextQuestionInput): Promise<TestExecutionOverviewResult>;
}
