import type { TestEntity } from '@modules/test-management';

export interface DeleteTestInput {
	test: TestEntity;
	authorId: string;
}
