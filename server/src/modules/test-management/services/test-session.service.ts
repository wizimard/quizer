import { inject, injectable } from 'inversify';
import { TM_TYPES } from '@modules/test-management/test-management.types';
import type { TestExecutionRepository } from '@modules/test-management';
import { APP_TYPES } from '@app/app.types';
import type { ILogger } from '@shared/logger';
import type { FinishTestInput } from '../interfaces/services/input/finish-test.input';
import type { StartTestInput } from '../interfaces/services/input/start-test.input';
import type { ITestSessionService } from '../interfaces/services/test-session.service.interface';
import { TestOpenError } from '../utils/errors/test-open.error';
import { TestClosedError } from '../utils/errors/test-closed.error';

@injectable()
export class TestSessionService implements ITestSessionService {
	constructor(
		@inject(TM_TYPES.TEST_EXECUTION_REPOSITORY) private readonly testExecutionRepository: TestExecutionRepository,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async startTest(input: StartTestInput): Promise<boolean> {
		this.logger.info({ message: 'TestSessionService.startTest start', data: input });

		if (input.test.isOpen) {
			throw new TestOpenError('TestSessionService.startTest', 'errors.start_test_open');
		}

		const test = await this.testExecutionRepository.startTest(input.test.id.value, input.finishedAt);

		this.logger.info({ message: 'TestSessionService.startTest test started:', data: test });

		return !!test;
	}

	async finishTest(input: FinishTestInput): Promise<boolean> {
		this.logger.info({ message: 'TestSessionService.finishTest start', data: input });

		if (!input.test.isOpen) {
			throw new TestClosedError('TestSessionService.finishTest', 'errors.finish_test_closed');
		}

		const count = await this.testExecutionRepository.finishTest(input.test.id.value);

		if (count > 0) {
			this.logger.info(`Test ${input.test.id} has a few active sessions, finished ${count} sessions`);
		}

		this.logger.info({ message: 'TestSessionService.finishTest test finished:', data: count });

		return count > 0;
	}
}
