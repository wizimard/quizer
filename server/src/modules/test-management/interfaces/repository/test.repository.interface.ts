import type { TestEntity } from '../../entities/test.entity';
import type { TestModelGetPayload } from '@prisma/models';
import type { TestModel } from '@prisma/client';

export type TestModelAll = TestModel &
	TestModelGetPayload<{
		select: {
			questions: true;
			test_settings: { select: { show_answers_after_completion: true } };
			scheduler_periods: true;
			test_sessions: true;
		};
	}>;

export type TestModelWithSessions = TestModel & TestModelGetPayload<{ select: { test_sessions: true } }>;

export type TestModelLaunch = TestModel & TestModelGetPayload<{ select: { test_sessions: { include: { _count: { select: { registered_users: true } } } } } }>;

export interface TestRepository {
	create(data: TestEntity): Promise<TestEntity | null>;
	update(data: TestEntity): Promise<TestEntity | null>;
	delete(id: string): Promise<boolean>;
	findById(id: string): Promise<TestEntity | null>;
	findFullById(id: string): Promise<TestEntity | null>;
	findByAuthor(authorId: string): Promise<TestEntity[]>;
}
