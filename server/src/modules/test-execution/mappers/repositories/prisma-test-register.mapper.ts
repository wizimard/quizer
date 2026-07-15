import type { TestExecutionUser } from '@modules/test-execution/entities/test-execution-user';
import type { TestSessionRegisteredUserModelCreateArgs, TestSessionRegisteredUserModelFindFirstArgs } from '@prisma/models';

export class PrismaTestRegisterMapper {
	static toRegisterUserPersistence(sessionId: string, firstName: string, lastName: string): TestSessionRegisteredUserModelCreateArgs['data'] {
		return {
			test_session_id: sessionId,
			first_name: firstName,
			last_name: lastName,
		};
	}

	static toFindRegisteredUserPersistence(sessionId: string, firstName: string, lastName: string): TestSessionRegisteredUserModelFindFirstArgs['where'] {
		return {
			test_session_id: sessionId,
			first_name: firstName,
			last_name: lastName,
		};
	}
}
