import type { TestExecutionUser } from '@modules/test-execution/entities/test-execution-user';
import type { TestSessionRegisteredUserModel } from '@prisma/client';
import type { TestSessionRegisteredUserModelGetPayload } from '@prisma/models';

export type TestRegisteredUserModel = TestSessionRegisteredUserModel & TestSessionRegisteredUserModelGetPayload<{ select: { answers: true } }>;

export interface TestRegisterRepository {
	registerUserForTest(sessionId: string, firstName: string, lastName: string): Promise<TestExecutionUser | null>;
	findRegisteredUser(sessionId: string, firstName: string, lastName: string): Promise<TestExecutionUser | null>;
	findRegisteredUserById(userId: string): Promise<TestExecutionUser | null>;
}
