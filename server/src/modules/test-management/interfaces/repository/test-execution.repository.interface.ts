import type { TestId } from '../../entities/value-object/test-id';
import type { ExecutableTest } from '../../entities/executable-test';
import type { UserId } from '@modules/identity-access';

export interface TestExecutionRepository {
	startTest(id: TestId, userId: UserId, finishedAt?: Date): Promise<ExecutableTest>;
	finishTest(id: TestId, userId: UserId): Promise<ExecutableTest>;
}
