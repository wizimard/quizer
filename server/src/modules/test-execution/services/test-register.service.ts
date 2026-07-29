import { TM_TYPES, TestNotFoundError, type TestEntity, type TestService } from '@modules/test-management';
import { inject, injectable } from 'inversify';
import type { TestRegisterUserInput } from '../interfaces/services/input/test-register-user.input';
import type { TestRegisteredUserResult } from '../interfaces/services/result/test-registered-user.result';
import { TestExecutionUser } from '../entities/test-execution-user';
import { TE_TYPES } from '../test-execution.types';
import type { TestRegisterRepository } from '../interfaces/repositories/test-register.repository.interface';
import { HttpError } from '@shared/error';
import { TestExecutionUserMapper } from '../mappers/test-execution-user.mapper';
import type { TestRegisterService } from '../interfaces/services/test-register.service.interface';
import { TestClosedError } from '@modules/test-management/utils/errors/test-closed.error'; // TODO
import type { TestSessionEntity } from '@modules/test-management';
import type { ILogger } from '@shared/logger';
import { APP_TYPES } from '@app/app.types';
import { getCurrentQuestion } from '../utils/get-current-question';

@injectable()
export class DefaultTestRegisterService implements TestRegisterService {
	constructor(
		@inject(TE_TYPES.TEST_REGISTER_REPOSITORY) private readonly testRegisterRepository: TestRegisterRepository,
		@inject(TM_TYPES.TEST_SERVICE) private readonly testService: TestService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async registerUserForTest(input: TestRegisterUserInput): Promise<TestRegisteredUserResult> {
		const test: TestEntity | null = await this.testService.getFullById(input.test.id);

		if (!test) {
			throw new TestNotFoundError('DefaultTestRegisterService registerUserForTest');
		}

		const session: TestSessionEntity | undefined = test.sessions[0];

		if (!session) {
			throw new TestClosedError('DefaultTestRegisterService registerUserForTest');
		}

		const registeredUser: TestExecutionUser | null = await this.testRegisterRepository.findRegisteredUser(session.id, input.firstName, input.lastName);

		if (registeredUser) {
			const { question, questionIndex } = getCurrentQuestion(session, test.questions, registeredUser.answers, this.logger);
			return TestExecutionUserMapper.toTestRegisteredUserResult(registeredUser, test, question, questionIndex);
		}

		const newRegisteredUser: TestExecutionUser | null = await this.testRegisterRepository.registerUserForTest(session.id, input.firstName, input.lastName);

		if (!newRegisteredUser) {
			throw new HttpError(500, 'Error registering user for test in database', 'DefaultTestRegisterService registerUserForTest');
		}

		const { question, questionIndex } = getCurrentQuestion(session, test.questions, newRegisteredUser.answers, this.logger);

		return TestExecutionUserMapper.toTestRegisteredUserResult(newRegisteredUser, test, question, questionIndex);
	}

	async getRegisteredSessionUsers(sessionId: string): Promise<Array<TestExecutionUser>> {
		return this.testRegisterRepository.findSessionRegisteredUsers(sessionId);
	}
}
