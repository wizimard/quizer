import type { TestSchedulerPeriod } from "../model/test-full.interface";
import type { TestSchedulerResponse } from "@shared/api/generated";

export function normalizeScheduler(scheduler: TestSchedulerResponse): Array<TestSchedulerPeriod> {
	return scheduler.periods.map((period) => ({
		...period,
		availableFrom: new Date(period.available_from),
		availableTo: period.available_to ? new Date(period.available_to) : null,
	}));
}
