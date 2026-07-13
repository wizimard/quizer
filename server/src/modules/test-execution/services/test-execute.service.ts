import { TM_TYPES, TestEntity, TestNotFoundError, type TestRepository } from '@modules/test-management';
import { inject, injectable } from 'inversify';
import type { TestExecuteGetInput } from '../interfaces/services/input/test-execute-get.input';
import type { TestExecuteResult } from '../interfaces/services/result/test-execute.result';
import { TestExecuteMapper } from '../mappers/test-execute.mapper';

@injectable()
export class TestExecuteService {
	constructor(@inject(TM_TYPES.TEST_REPOSITORY) private readonly testRepository: TestRepository) {}

	async getTest(input: TestExecuteGetInput): Promise<TestExecuteResult> {
		const test: TestEntity | null = await this.testRepository.findFullById(input.testId.value);

		if (!test) {
			throw new TestNotFoundError('TestExecuteService.getTest');
		}

		return TestExecuteMapper.toResult(test);
	}
}
