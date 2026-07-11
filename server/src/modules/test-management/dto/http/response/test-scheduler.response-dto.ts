export interface TestSchedulerResponsePeriod {
	id: number;
	test_id: string;
	available_from: Date;
	available_to?: Date | null | undefined;
}

export interface TestSchedulerResponse {
	periods: Array<TestSchedulerResponsePeriod>;
}
