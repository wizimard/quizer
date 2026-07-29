import { HttpError } from '@shared/error';

export class SchedulerEditPeriodsValidationFailedError extends HttpError {
	constructor(message: string = 'errors.scheduler_update_periods_time', context: string = 'TestSchedulerService.updateSchedulerPeriods') {
		super(422, message, context);
	}
}
