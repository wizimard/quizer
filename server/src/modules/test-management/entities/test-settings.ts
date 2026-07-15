import type { TestId } from './value-object/test-id';

export class TestSettings {
	public readonly testId: TestId;

	public isShowAnswersAfterCompletion: boolean;

	constructor(testId: TestId, isShowAnswersAfterCompletion: boolean = false) {
		this.testId = testId;
		this.isShowAnswersAfterCompletion = isShowAnswersAfterCompletion;
	}
}
