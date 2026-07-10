import type { ITestSchedulerPeriod } from '../entities/test-scheduler-period.interface';
import type { ITest } from '../entities/test.interface';
import type { CreateTestInput } from './input/create-test.input';
import type { DeleteTestInput } from './input/delete-test.input';
import type { GetAuthorTestsInput } from './input/get-author-tests.input';
import type { UpdateTestSchedulerInput } from './input/update-test-scheduler.input';
import type { UpdateTestSettingsInput } from './input/update-test-settings.input';
import type { UpdateTestInput } from './input/update-test.input';

export interface ITestService {
	create(input: CreateTestInput): Promise<ITest>;
	update(input: UpdateTestInput): Promise<ITest>;
	delete(input: DeleteTestInput): Promise<void>;
	getByAuthor(input: GetAuthorTestsInput): Promise<ITest[]>;
	updateSettings(input: UpdateTestSettingsInput): Promise<ITest>;
	updateSchedulerPeriods(input: UpdateTestSchedulerInput): Promise<Array<ITestSchedulerPeriod>>;
}
