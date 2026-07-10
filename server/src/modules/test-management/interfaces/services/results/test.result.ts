import type { UserId } from '@modules/identity-access';
import type { TestId } from '@modules/test-management';
import type { TestStatus } from '@modules/test-management/entities/test.entity';

export interface TestResult {
	id: TestId;
	authorId: UserId;
	status: TestStatus;
	title: string;
	updatedAt: Date;
	createdAt: Date;
}
