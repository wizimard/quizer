import type { UpdateTestSettingsInput } from './input/update-test-settings.input';
import type { TestFullResult } from './results/test-full.result';

export interface TestSettingsService {
	updateSettings(input: UpdateTestSettingsInput): Promise<TestFullResult>;
}
