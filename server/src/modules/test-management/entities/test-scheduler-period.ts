import type { ITestSchedulerPeriod, ITestSchedulerPeriodBase } from '../interfaces/test-scheduler-period.interface';

export class TestSchedulerPeriod implements ITestSchedulerPeriod {
	constructor(
		public readonly id: number,
		public readonly testId: string,
		public available_from: Date,
		public available_to?: Date | null,
	) {}

	public toObject(): ITestSchedulerPeriodBase {
		return {
			id: this.id,
			testId: this.testId,
			available_from: this.available_from,
			available_to: this.available_to,
		};
	}
}
