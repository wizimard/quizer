import type { TestId } from './value-object/test-id';
import type { ITestSettings, ITestSettingsBase } from '../interfaces/test-settings.interface';

export class TestSettings implements ITestSettings {
	constructor(
		public readonly testId: TestId,
		public isRequiredEmail: boolean,
		public isRequiredFirstName: boolean,
		public isRequiredLastName: boolean,
		public isShowAnswersAfterCompletion: boolean = false,
	) {}

	toObject(): ITestSettingsBase {
		return {
			isRequiredEmail: this.isRequiredEmail,
			isRequiredFirstName: this.isRequiredFirstName,
			isRequiredLastName: this.isRequiredLastName,
			isShowAnswersAfterCompletion: this.isShowAnswersAfterCompletion,
		};
	}
}
