import type { TestStatus } from '@modules/test-management/entities/test.entity';

export interface TestResponse {
	id: string;
	author_id: string;
	status: TestStatus;
	title: string;
	updated_at: Date;
	created_at: Date;
}
