import type { TestSessionModel } from '@prisma/client';
import type { ExecutableTest } from '../entities/executable-test';
import type { TTestModelWithSessions } from '../interfaces/repository/test.repository.interface';

export const ExecutableTestMapper = {
	toReadModel(row: TTestModelWithSessions): ExecutableTest {
		const currentDate = new Date();
		const isOpen = row.test_sessions.some((session: TestSessionModel) => session.status === 'ACTIVE' && (!session.finished_at || session.finished_at > currentDate));

		return {
			id: row.id,
			authorId: row.author_id,
			title: row.title,
			isOpen,
		};
	},
};
