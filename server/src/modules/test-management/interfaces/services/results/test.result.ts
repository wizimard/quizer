import type { TestStatus } from '@modules/test-management/entities/test.entity';

export interface TestResult {
	id: string;
	authorId: string;
	status: TestStatus;
	title: string;
	updatedAt: Date;
	createdAt: Date;
}
