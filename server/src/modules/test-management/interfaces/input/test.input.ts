import type { TestEntity } from '../../entities/test.entity';

export interface CreateTestInput {
	title: string;
	authorId: string;
}

export interface UpdateTestInput {
	id: string;
	authorId: string;
	title?: string;
}

export interface DeleteTestInput {
	testId: string;
	authorId: string;
}

export interface UpdateTestSettingsInput {
	test: TestEntity;
	title: string;
	isRequiredEmail: boolean;
	isRequiredFirstName: boolean;
	isRequiredLastName: boolean;
	isShowAnswersAfterCompletion: boolean;
}

export interface UpdateTestSchedulerPeriodsInput {
	test: TestEntity;
	availablePeriods: {
		add?: Array<{ available_from: Date; available_to?: Date }>;
		update?: Array<{ id: number; available_from: Date; available_to?: Date }>;
		remove?: Array<number>;
	};
}

export interface GetTestByIdInput {
	testId: string;
	userId: string;
}

export interface GetAuthorTestsInput {
	authorId: string;
}
