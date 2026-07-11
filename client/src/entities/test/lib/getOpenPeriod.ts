import type { TestFull, TestSchedulerPeriod } from "../model/test-full.interface";

export function getOpenPeriod(test: TestFull): TestSchedulerPeriod | undefined {
	const now: Date = new Date();

	return test.schedulerPeriods.find((period) => {
		return period.availableFrom <= now && (!period.availableTo || period.availableTo >= now);
	});
}
