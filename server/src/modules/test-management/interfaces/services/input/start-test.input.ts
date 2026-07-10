import type { TestEntity } from '@modules/test-management';

export interface StartTestInput {
	test: TestEntity;
	finishedAt?: Date;
}
