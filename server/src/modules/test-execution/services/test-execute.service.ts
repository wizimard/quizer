import { TM_TYPES, TestEntity, TestNotFoundError, type TestService } from '@modules/test-management';
import { inject, injectable } from 'inversify';
import type { TestExecuteGetInput } from '../interfaces/services/input/test-execute-get.input';
import type { TestExecuteResult } from '../interfaces/services/result/test-execute.result';
import { TestExecuteMapper } from '../mappers/test-execute.mapper';
import type { TestExecuteService } from '../interfaces/services/test-execute.service.interface';

@injectable()
export class DefaultTestExecuteService implements TestExecuteService {
	constructor(@inject(TM_TYPES.TEST_SERVICE) private readonly testService: TestService) {}

	async getTest(input: TestExecuteGetInput): Promise<TestExecuteResult> {
		const test: TestEntity | null = await this.testService.getFullById(input.testId);

		if (!test) {
			throw new TestNotFoundError('TestExecuteService getTest');
		}

		return TestExecuteMapper.toResult(test);
	}
}
