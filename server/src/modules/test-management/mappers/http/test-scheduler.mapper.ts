import type { ITestSchedulerResponse } from '@modules/test-management/interfaces/http/scheduler-response.interface';
import type { ITestSchedulerPeriod } from '@modules/test-management/interfaces/entities/test-scheduler-period.interface';
import { SchedulerPeriodMapper } from '../scheduler-period.mapper';

export class TestSchedulerPeriodMapper {
	static toHttp(dto: Array<ITestSchedulerPeriod>): ITestSchedulerResponse {
		return {
			periods: dto.map(SchedulerPeriodMapper.toResponse),
		};
	}
}
