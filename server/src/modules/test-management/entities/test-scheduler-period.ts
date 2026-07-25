export class TestSchedulerPeriod {
	public readonly id: number;
	public readonly testId: string;
	public availableFrom: Date;
	public availableTo?: Date | null;

	constructor(id: number, testId: string, availableFrom: Date, availableTo?: Date | null) {
		this.id = id;
		this.testId = testId;
		this.availableFrom = availableFrom;
		this.availableTo = availableTo ?? null;
	}
}
