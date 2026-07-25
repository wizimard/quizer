export interface TestSchedulerResultPeriod {
	id: number;
	testId: string;
	availableFrom: Date;
	availableTo?: Date | null | undefined;
}

export interface TestSchedulerResult {
	periods: Array<TestSchedulerResultPeriod>;
}
