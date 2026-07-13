import type { CreateTestInput } from './input/create-test.input';
import type { DeleteTestInput } from './input/delete-test.input';
import type { GetAuthorTestsInput } from './input/get-author-tests.input';
import type { UpdateTestSchedulerInput } from './input/update-test-scheduler.input';
import type { UpdateTestSettingsInput } from './input/update-test-settings.input';
import type { UpdateTestInput } from './input/update-test.input';
import type { TestSchedulerResultPeriod } from './results/test-scheduler.result';
import type { TestFullResult } from './results/test-full.result';
import type { TestResult } from './results/test.result';
import type { GetTestByIdInput } from './input/get-test-by-id.input';
import type { GetFullTestByIdInput } from './input/get-full-test-by-id.input';

export interface ITestService {
	create(input: CreateTestInput): Promise<TestFullResult>;
	update(input: UpdateTestInput): Promise<TestFullResult>;
	delete(input: DeleteTestInput): Promise<void>;
	getByAuthor(input: GetAuthorTestsInput): Promise<TestResult[]>;
	getFullById(input: GetFullTestByIdInput): Promise<TestFullResult>;
	getById(input: GetTestByIdInput): Promise<TestResult>;
	updateSettings(input: UpdateTestSettingsInput): Promise<TestFullResult>;
	updateSchedulerPeriods(input: UpdateTestSchedulerInput): Promise<Array<TestSchedulerResultPeriod>>;
}
