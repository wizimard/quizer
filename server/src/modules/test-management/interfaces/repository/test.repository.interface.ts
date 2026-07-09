import type { UserId } from '@modules/identity-access';
import type { TestEntity } from '../../entities/test.entity';
import type { ITestSchedulerPeriod } from '../test-scheduler-period.interface';
import type { TestId } from '../../entities/value-object/test-id';
import type { TestModelGetPayload, TestSettingsModelGetPayload } from '@prisma/models';
import type { TestModel, TestSettingsModel } from '@prisma/client';

export type TTestSettingsModelAll = TestSettingsModel &
	TestSettingsModelGetPayload<{ select: { show_answers_after_completion: true; required_email: true; required_first_name: true; required_last_name: true } }>;

export type TTestModelWithQuestions = TestModel & TestModelGetPayload<{ select: { questions: true } }>;

export type TTestModelAll = TestModel &
	TestModelGetPayload<{
		select: {
			questions: true;
			test_settings: { select: { show_answers_after_completion: true; required_email: true; required_first_name: true; required_last_name: true } };
			scheduler_periods: true;
			test_sessions: true;
		};
	}>;

export type TTestModelWithSessions = TestModel & TestModelGetPayload<{ select: { test_sessions: true } }>;

export interface ITestUpdateSettingsData {
	title: string;
	isRequiredEmail: boolean;
	isRequiredFirstName: boolean;
	isRequiredLastName: boolean;
	isShowAnswersAfterCompletion: boolean;
}

export interface ITestUpdateSchedulerPeriodsData {
	availablePeriods: {
		add?: Array<ITestSchedulerPeriod>;
		update?: Array<ITestSchedulerPeriod>;
		remove?: Array<number>;
	};
}

export interface TestRepository {
	create(data: TestEntity): Promise<TestEntity>;
	update(data: TestEntity): Promise<TestEntity>;
	delete(id: TestId): Promise<boolean>;
	findById(id: TestId): Promise<TestEntity | null>;
	findFullById(id: TestId): Promise<TestEntity | null>;
	findByAuthor(authorId: UserId): Promise<TestEntity[]>;
	updateSettings(testId: TestId, updateSettingsData: ITestUpdateSettingsData): Promise<TestEntity>;
	updateSchedulerPeriods(testId: TestId, updateData: ITestUpdateSchedulerPeriodsData): Promise<boolean>;
}
