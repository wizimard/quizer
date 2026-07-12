import type { TestEntity } from '@modules/test-management';
import type { UserId } from '@modules/identity-access';

export interface DeleteTestInput {
	test: TestEntity;
	authorId: UserId;
}
