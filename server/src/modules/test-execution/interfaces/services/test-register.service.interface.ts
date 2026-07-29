import type { TestRegisterUserInput } from './input/test-register-user.input';
import type { TestRegisteredUserResult } from './result/test-registered-user.result';
import type { TestExecutionUser } from '@modules/test-execution/entities/test-execution-user';

export interface TestRegisterService {
	registerUserForTest(input: TestRegisterUserInput): Promise<TestRegisteredUserResult>;
	getRegisteredSessionUsers(sessionId: string): Promise<Array<TestExecutionUser>>;
}
