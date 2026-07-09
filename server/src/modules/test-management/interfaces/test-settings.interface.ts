// TODO: review
export interface ITestSettingsBase {
	isRequiredEmail: boolean;
	isRequiredFirstName: boolean;
	isRequiredLastName: boolean;
	isShowAnswersAfterCompletion: boolean;
}

export interface ITestSettings extends ITestSettingsBase {
	toObject(): ITestSettingsBase;
}
