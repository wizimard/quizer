import type { TestEntity } from '@modules/test-management';
import type { TestExecuteResponse } from '../dto/response/test-execute-response.dto';
import { QuestionExecuteMapper } from './question-execute.mapper';
import type { TestExecuteResult } from '../interfaces/services/result/test-execute.result';
import { TestSessionStatus } from '@prisma/client';

export class TestExecuteMapper {
	static toResult(test: TestEntity): TestExecuteResult {
		const executionTest: TestExecuteResult = {
			id: test.id,
			title: test.title,
			status: test.status,
			questions: test.questions,
		};

		if (test.isOpen) {
			const session = test.sessions.find((session) => session.status === TestSessionStatus.ACTIVE);

			if (session) {
				executionTest.openFromAt = session.startedAt;

				if (session.finishedAt) {
					executionTest.openUntilAt = session.finishedAt;
				}
			}
		}

		return executionTest;
	}

	static toResponse(test: TestExecuteResult): TestExecuteResponse {
		const testExectuin: TestExecuteResponse = {
			id: test.id.value,
			title: test.title,
			status: test.status,
			questions: test.questions.map(QuestionExecuteMapper.toResponse),
		};

		if (test.openFromAt) {
			testExectuin.open_from_at = test.openFromAt;
		}

		if (test.openUntilAt) {
			testExectuin.open_until_at = test.openUntilAt;
		}

		return testExectuin;
	}
}
