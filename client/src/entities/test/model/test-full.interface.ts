import type { TestSettings as TestSettingsResponse, TestSchedulerPeriodResponse, TestFullResponse } from "@shared/api/generated";
import type { Question } from "@entities/question";

export interface TestSchedulerPeriod extends Pick<TestSchedulerPeriodResponse, "id"> {
	availableFrom: Date;
	availableTo: Date | null;
}

export interface TestSettings extends TestSettingsResponse {
	isRequiredEmail: boolean;
	isRequiredFirstName: boolean;
	isRequiredLastName: boolean;
	isShowAnswersAfterCompletion: boolean;
}

export interface TestFull extends Omit<TestFullResponse, "settings" | "scheduler" | "author_id" | "updated_at" | "created_at" | "questions"> {
	authorId: string;
	settings: TestSettings;
	schedulerPeriods: Array<TestSchedulerPeriod>;
	updatedAt: Date;
	createdAt: Date;
	questions: Array<Question>;
}
