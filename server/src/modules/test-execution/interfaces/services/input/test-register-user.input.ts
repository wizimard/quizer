import type { TestEntity } from '@modules/test-management';

export interface TestRegisterUserInput {
	test: TestEntity;

	firstName: string;
	lastName: string;
}
