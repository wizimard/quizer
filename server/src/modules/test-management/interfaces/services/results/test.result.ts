import type { TestStatus } from '@modules/test-management/entities/test.entity';

export interface TestResult {
	id: string;
	authorId: string;
	status: TestStatus;
	title: string;
	launchesCount: number;
	lastLaunchDate: Date | null;
	updatedAt: Date;
	createdAt: Date;
}
