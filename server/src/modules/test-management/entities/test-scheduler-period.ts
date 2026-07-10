import type { TestId } from './value-object/test-id';

export class TestSchedulerPeriod {
	public readonly id: number;
	public readonly testId: TestId;
	public availableFrom: Date;
	public availableTo?: Date | null;

	constructor(id: number, testId: TestId, availableFrom: Date, availableTo?: Date | null) {
		this.id = id;
		this.testId = testId;
		this.availableFrom = availableFrom;
		this.availableTo = availableTo ?? null;
	}
}
