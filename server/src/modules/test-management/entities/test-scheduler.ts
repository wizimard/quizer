import type { TestSchedulerPeriod } from './test-scheduler-period';

export class TestScheduler {
	public readonly testId: string;

	private _periods: Array<TestSchedulerPeriod> = [];

	constructor(testId: string, periods: Array<TestSchedulerPeriod>) {
		this.testId = testId;
		this._periods = periods;
	}

	get periods(): Array<TestSchedulerPeriod> {
		return this._periods;
	}

	public addPeriods(periods: Array<TestSchedulerPeriod>): void {
		this._periods.push(...periods);
	}
}
