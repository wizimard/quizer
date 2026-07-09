export interface TestSchedulerPeriodDto {
	id: number;
	testId: string;
	availableFrom: Date;
	availableTo?: Date | null | undefined;
}

export interface TestSettingsDto {
	isRequiredEmail: boolean;
	isRequiredFirstName: boolean;
	isRequiredLastName: boolean;
	isShowAnswersAfterCompletion: boolean;
}
