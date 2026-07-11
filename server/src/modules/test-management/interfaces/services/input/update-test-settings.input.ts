import type { TestEntity } from '@modules/test-management/entities/test.entity';

export interface UpdateTestSettingsInput {
	test: TestEntity;

	title: string;
	isRequiredEmail: boolean;
	isRequiredFirstName: boolean;
	isRequiredLastName: boolean;
	isShowAnswersAfterCompletion: boolean;
}
