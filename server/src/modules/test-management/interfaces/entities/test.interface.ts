import type { TestStatus } from '@modules/test-management/entities/test.entity';
import type { IQuestion } from '../../interfaces/entities/question.interface';
import type { ITestSchedulerPeriod } from '../../interfaces/entities/test-scheduler-period.interface';
import type { ITestSettings } from '../../interfaces/entities/test-settings.interface';

export interface ITest {
	id: string;
	authorId: string;
	title: string;
	status: TestStatus;
	questions: IQuestion[];
	settings: ITestSettings;
	schedulerPeriods: ITestSchedulerPeriod[];
	updatedAt: Date;
	createdAt: Date;
}
