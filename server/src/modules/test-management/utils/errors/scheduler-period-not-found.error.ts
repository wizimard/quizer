import { HttpError } from '@shared/error';

export class SchedulerPeriodNotFoundError extends HttpError {
	constructor(context: string = 'TestSchedulerService.updateSchedulerPeriods') {
		super(404, 'errors.scheduler.period_not_found', context);
	}
}
