import { inject, injectable } from 'inversify';
import { TM_TYPES } from '@modules/test-management/test-management.types';
import type { StartTestInput } from '../types/start-test.input';
import type { FinishTestInput } from '../types/finish-test.input';
import type { ExecutableTestDto } from '../dto/executable-test.dto';
import { toExecutableTestDtoFromReadModel } from '../mappers/to-executable-test.dto';
import type { TestExecutionRepository } from '@modules/test-management';

@injectable()
export class TestSessionService {
	constructor(@inject(TM_TYPES.TEST_EXECUTION_REPOSITORY) private readonly testExecutionRepository: TestExecutionRepository) {}

	async startTest(input: StartTestInput): Promise<ExecutableTestDto> {
		const test = await this.testExecutionRepository.startTest(input.test.id, input.test.authorId, input.finishedAt);

		return toExecutableTestDtoFromReadModel(test);
	}

	async finishTest(input: FinishTestInput): Promise<ExecutableTestDto> {
		const test = await this.testExecutionRepository.finishTest(input.test.id, input.test.authorId);

		return toExecutableTestDtoFromReadModel(test);
	}
}
