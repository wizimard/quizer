import type { QuestionResult } from './question.result';
import type { TestSchedulerResult } from './test-scheduler.result';
import type { TestResult } from './test.result';

export interface TestFullResultSettings {
	isShowAnswersAfterCompletion: boolean;
}

export interface TestFullResult extends TestResult {
	questions: Array<QuestionResult>;
	settings: TestFullResultSettings;
	scheduler: TestSchedulerResult;
}
