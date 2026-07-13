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
			isOpen: test.isOpen,
			questions: test.questions,
			settings: {
				isRequiredEmail: test.settings?.isRequiredEmail ?? false,
				isRequiredFirstName: test.settings?.isRequiredFirstName ?? true,
				isRequiredLastName: test.settings?.isRequiredLastName ?? true,
			},
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
		const credentials: Array<string> = [];

		if (test.settings?.isRequiredEmail) {
			credentials.push('email');
		}

		if (test.settings?.isRequiredFirstName) {
			credentials.push('first_name');
		}

		if (test.settings?.isRequiredLastName) {
			credentials.push('last_name');
		}

		const testExectuin: TestExecuteResponse = {
			id: test.id.value,
			title: test.title,
			is_open: test.isOpen,
			questions: test.questions.map(QuestionExecuteMapper.toResponse),
			register_credentials: credentials,
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
