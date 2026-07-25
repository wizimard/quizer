export class TestSettings {
	public readonly testId: string;

	public isShowAnswersAfterCompletion: boolean;

	constructor(testId: string, isShowAnswersAfterCompletion: boolean = false) {
		this.testId = testId;
		this.isShowAnswersAfterCompletion = isShowAnswersAfterCompletion;
	}
}
