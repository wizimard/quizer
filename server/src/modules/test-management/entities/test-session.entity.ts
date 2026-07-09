import type { TestId } from './value-object/test-id';
import type { TestSessionStatus } from '@prisma/client';

export class TestSessionEntity {
	constructor(
		public readonly id: string,
		public readonly testId: TestId,
		public readonly startedAt: Date,
		public readonly finishedAt: Date | null,
		public readonly status: TestSessionStatus,
	) {}
}
