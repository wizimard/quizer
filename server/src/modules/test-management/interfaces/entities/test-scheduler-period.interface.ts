import type { TestId } from '@modules/test-management/entities/value-object/test-id';

export interface ITestSchedulerPeriod {
	id: number;
	testId: TestId;
	availableFrom: Date;
	availableTo?: Date | null | undefined;
}
