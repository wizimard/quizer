import type { TestSchedulerResponse } from '../../dto/http/response/test-scheduler.response-dto';
import type { TestSchedulerResultPeriod } from '../../interfaces/services/results/test-scheduler.result';
import { SchedulerPeriodResponseMapper } from './scheduler-period-response.mapper';

export class SchedulerResponseMapper {
	static toResponse(periods: Array<TestSchedulerResultPeriod>): TestSchedulerResponse {
		return {
			periods: periods.map(SchedulerPeriodResponseMapper.toResponse),
		};
	}
}
