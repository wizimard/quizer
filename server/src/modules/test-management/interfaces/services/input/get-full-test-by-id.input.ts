import type { TestId } from '@modules/test-management';
import type { UserId } from '@modules/identity-access';

export interface GetFullTestByIdInput {
	testId: TestId;
	userId: UserId;
}
