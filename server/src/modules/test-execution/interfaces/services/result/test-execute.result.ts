import type { QuestionEntity, TestId } from '@modules/test-management';

export interface TestExecuteSettingsResult {
	isRequiredEmail: boolean;
	isRequiredFirstName: boolean;
	isRequiredLastName: boolean;
}

export interface TestExecuteResult {
	id: TestId;
	title: string;
	isOpen: boolean;
	openFromAt?: Date;
	openUntilAt?: Date;
	questions: Array<QuestionEntity>;
	settings: TestExecuteSettingsResult;
}
