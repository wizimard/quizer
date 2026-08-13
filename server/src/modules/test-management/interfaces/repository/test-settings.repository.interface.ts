import type { TestEntity } from '@modules/test-management/entities/test.entity';

export interface TestUpdateSettingsData {
	title: string;
	isShowAnswersAfterCompletion: boolean;
}

export interface TestSettingsRepository {
	updateSettings(testId: string, updateSettingsData: TestUpdateSettingsData): Promise<TestEntity | null>;
}
