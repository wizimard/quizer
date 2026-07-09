import type { TestSchedulerPeriodDto, TestSettingsDto } from './test-settings.entity.dto';
import type { TestSessionStatus } from '@prisma/client';

export interface QuestionDto {
	id: string;
	testId: string;
	sortKey: number;
	description: string;
	config: object;
}

export interface TestDto {
	id: string;
	authorId: string;
	title: string;
	status: TestSessionStatus;
	questions: QuestionDto[];
	settings: TestSettingsDto;
	schedulerPeriods: TestSchedulerPeriodDto[];
	updatedAt: Date;
	createdAt: Date;
}
