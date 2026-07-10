import type { TestId } from '@modules/test-management';
import type { UserId } from '@modules/identity-access';

export interface GetTestByIdInput {
	testId: TestId;
	userId: UserId;
}
