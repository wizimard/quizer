import type { TestEntity } from '@modules/test-management/entities/test.entity';

export interface UpdateTestInput {
	test: TestEntity;

	changes: {
		title?: string;
	};
}
