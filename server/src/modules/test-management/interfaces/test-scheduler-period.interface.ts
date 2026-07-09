// TODO: review
export interface ITestSchedulerPeriodBase {
	id: number;
	testId: string;
	available_from: Date;
	available_to?: Date | undefined | null;
}

export interface ITestSchedulerPeriod extends ITestSchedulerPeriodBase {
	toObject(): ITestSchedulerPeriodBase;
}
