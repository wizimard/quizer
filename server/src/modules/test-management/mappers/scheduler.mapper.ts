import type { TestSchedulerResponse } from '../dto/http/response/test-scheduler.response-dto';
import type { TestSchedulerResultPeriod } from '../interfaces/services/results/test-scheduler.result';
import { SchedulerPeriodMapper } from './scheduler-period.mapper';

export class SchedulerMapper {
	static toResponse(periods: Array<TestSchedulerResultPeriod>): TestSchedulerResponse {
		return {
			periods: periods.map(SchedulerPeriodMapper.toResponse),
		};
	}
}
