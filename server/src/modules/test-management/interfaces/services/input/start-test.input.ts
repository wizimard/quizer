import type { TestEntity } from '@modules/test-management';
import type { TestSessionRunMode } from '@prisma/enums';

export interface StartTestInput {
	test: TestEntity;
	runMode: TestSessionRunMode;
	finishedAt?: Date;
}
