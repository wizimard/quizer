import type { TestEntity } from '../../entities/test.entity';
import type { ITestSchedulerPeriod } from '../entities/test-scheduler-period.interface';
import type { TestModelGetPayload, TestSettingsModelGetPayload } from '@prisma/models';
import type { TestModel, TestSchedulerPeriodModel, TestSettingsModel } from '@prisma/client';

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
	add?: Array<ITestSchedulerPeriod>;
	update?: Array<ITestSchedulerPeriod>;
	remove?: Array<number>;
}

export interface TestRepository {
	create(data: TestEntity): Promise<TestEntity>;
	update(data: TestEntity): Promise<TestEntity>;
	delete(id: string): Promise<boolean>;
	findById(id: string): Promise<TestEntity | null>;
	findFullById(id: string): Promise<TestEntity | null>;
	findByAuthor(authorId: string): Promise<TestEntity[]>;
	updateSettings(testId: string, updateSettingsData: ITestUpdateSettingsData): Promise<TestEntity>;
	updateSchedulerPeriods(testId: string, updateData: ITestUpdateSchedulerPeriodsData): Promise<Array<TestSchedulerPeriodModel>>;
}
