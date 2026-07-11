import { inject, injectable } from 'inversify';
import { TM_TYPES } from '@modules/test-management/test-management.types';
import type { TestExecutionRepository } from '@modules/test-management';
import { APP_TYPES } from '@app/app.types';
import type { ILogger } from '@shared/logger';
import type { FinishTestInput } from '../interfaces/services/input/finish-test.input';
import type { StartTestInput } from '../interfaces/services/input/start-test.input';
import type { ITestSessionService } from '../interfaces/services/test-session.service.interface';

@injectable()
export class TestSessionService implements ITestSessionService {
	constructor(
		@inject(TM_TYPES.TEST_EXECUTION_REPOSITORY) private readonly testExecutionRepository: TestExecutionRepository,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async startTest(input: StartTestInput): Promise<boolean> {
		const test = await this.testExecutionRepository.startTest(input.test.id.value, input.finishedAt);

		return !!test;
	}

	async finishTest(input: FinishTestInput): Promise<boolean> {
		const count = await this.testExecutionRepository.finishTest(input.test.id.value);

		if (count > 0) {
			this.logger.info(`Test ${input.test.id} has a few active sessions, finished ${count} sessions`);
		}

		return count > 0;
	}
}
