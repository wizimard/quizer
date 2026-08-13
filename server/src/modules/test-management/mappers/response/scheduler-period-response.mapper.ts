import type { TestSchedulerResponsePeriod } from '../../dto/http/response/test-scheduler.response-dto';
import type { TestSchedulerResultPeriod } from '../../interfaces/services/results/test-scheduler.result';

export class SchedulerPeriodResponseMapper {
	static toResponse(period: TestSchedulerResultPeriod): TestSchedulerResponsePeriod {
		return {
			id: period.id,
			test_id: period.testId,
			available_from: period.availableFrom,
			available_to: period.availableTo,
		};
	}
}
