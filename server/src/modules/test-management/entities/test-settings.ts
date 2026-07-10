import type { ITestSettings } from '../interfaces/entities/test-settings.interface';
import type { TestId } from './value-object/test-id';

export class TestSettings implements ITestSettings {
	public readonly testId: TestId;
	public isRequiredEmail: boolean;
	public isRequiredFirstName: boolean;
	public isRequiredLastName: boolean;
	public isShowAnswersAfterCompletion: boolean;

	constructor(testId: TestId, isRequiredEmail: boolean, isRequiredFirstName: boolean, isRequiredLastName: boolean, isShowAnswersAfterCompletion: boolean = false) {
		this.testId = testId;
		this.isRequiredEmail = isRequiredEmail;
		this.isRequiredFirstName = isRequiredFirstName;
		this.isRequiredLastName = isRequiredLastName;
		this.isShowAnswersAfterCompletion = isShowAnswersAfterCompletion;
	}
}
