export interface ITestSchedulerPeriodResponse {
	id: number;
	testId: string;
	availableFrom: Date;
	availableTo?: Date | null | undefined;
}

export interface ITestSchedulerResponse {
	periods: Array<ITestSchedulerPeriodResponse>;
}
