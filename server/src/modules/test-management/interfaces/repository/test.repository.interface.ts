import type { TestEntity } from '../../entities/test.entity';
import type { TestModelGetPayload, TestSettingsModelGetPayload } from '@prisma/models';
import type { TestModel, TestSchedulerPeriodModel, TestSettingsModel } from '@prisma/client';
import type { TestSchedulerPeriod } from '@modules/test-management/entities/test-scheduler-period';

export type TTestSettingsModelAll = TestSettingsModel & TestSettingsModelGetPayload<{ select: { show_answers_after_completion: true } }>;

export type TTestModelWithQuestions = TestModel & TestModelGetPayload<{ select: { questions: true } }>;

export type TTestModelAll = TestModel &
	TestModelGetPayload<{
		select: {
			questions: true;
			test_settings: { select: { show_answers_after_completion: true } };
			scheduler_periods: true;
			test_sessions: true;
		};
	}>;

export type TTestModelWithSessions = TestModel & TestModelGetPayload<{ select: { test_sessions: true } }>;

export interface ITestUpdateSettingsData {
	title: string;
	isShowAnswersAfterCompletion: boolean;
}

export interface ITestUpdateSchedulerPeriodsData {
	add?: Array<TestSchedulerPeriod>;
	update?: Array<TestSchedulerPeriod>;
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
	getScheduler(testId: string): Promise<Array<TestSchedulerPeriodModel>>;
	updateSchedulerPeriods(testId: string, updateData: ITestUpdateSchedulerPeriodsData): Promise<Array<TestSchedulerPeriodModel>>;
}
