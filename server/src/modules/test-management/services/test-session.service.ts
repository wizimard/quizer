import { inject, injectable } from 'inversify';
import { TM_TYPES } from '@modules/test-management/test-management.types';
import { APP_TYPES } from '@app/app.types';
import type { ILogger } from '@shared/logger';
import type { FinishTestInput } from '../interfaces/services/input/finish-test.input';
import type { StartTestInput } from '../interfaces/services/input/start-test.input';
import type { TestSessionService } from '../interfaces/services/test-session.service.interface';
import { TestOpenError } from '../utils/errors/test-open.error';
import { TestClosedError } from '../utils/errors/test-closed.error';
import type { TestSessionRepository } from '../interfaces/repository/test-session.repository.interface';
import type { NextQuestionInput } from '../interfaces/services/input/next-question.input';
import type { TestExecutionManualModeOverviewResult, TestExecutionOverviewResult } from '../interfaces/services/results/test-overview-result';
import type { TestOverviewService } from '../interfaces/services/test-overview.service.interface';
import { TestSessionRunMode, type TestSessionModel } from '@prisma/client';
import { HttpError } from '@shared/error';

@injectable()
export class DefaultTestSessionService implements TestSessionService {
	constructor(
		@inject(TM_TYPES.TEST_SESSION_REPOSITORY) private readonly testSessionRepository: TestSessionRepository,
		@inject(TM_TYPES.TEST_OVERVIEW_SERVICE) private readonly testOverviewService: TestOverviewService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async startTest(input: StartTestInput): Promise<boolean> {
		this.logger.info({ message: '[TestSessionService startTest] start', data: input });

		if (input.test.isOpen) {
			throw new TestOpenError('[TestSessionService startTest]', 'errors.start_test_open');
		}

		const test = await this.testSessionRepository.startTest(input.test.id, input.runMode, input.finishedAt);

		this.logger.info({ message: '[TestSessionService startTest] test started', data: test });

		return !!test;
	}

	async finishTest(input: FinishTestInput): Promise<boolean> {
		this.logger.info({ message: '[TestSessionService finishTest] start', data: input });

		if (!input.test.isOpen) {
			throw new TestClosedError('TestSessionService finishTest', 'errors.finish_test_closed');
		}

		const count = await this.testSessionRepository.finishTest(input.test.id);

		if (count > 0) {
			this.logger.info(`Test ${input.test.id} has a few active sessions, finished ${count} sessions`);
		}

		this.logger.info({ message: '[TestSessionService finishTest] test finished', data: count });

		return count > 0;
	}

	async nextQuestion(input: NextQuestionInput): Promise<TestExecutionOverviewResult> {
		this.logger.info({ message: '[TestSessionService nextQuestion] start', data: input });

		const overview = (await this.testOverviewService.getTestExecutionOverview(input)) as TestExecutionManualModeOverviewResult;

		if (overview.test.runMode !== TestSessionRunMode.MANUAL || !overview.test.session) {
			throw new HttpError(403, 'TestSessionService nextQuestion', 'errors.next_question_not_allowed');
		}

		const question = overview.questions.find((q) => q.id === input.questionId);

		if (!question) {
			throw new HttpError(422, 'TestSessionService nextQuestion', 'errors.question_not_found');
		}

		if (question.id === overview.currentQuestion?.id) {
			throw new HttpError(422, 'TestSessionService nextQuestion', 'errors.question_already_current');
		}

		const session: TestSessionModel | null = await this.testSessionRepository.nextQuestion(overview.test.session.id, input.questionId);

		if (!session) {
			throw new Error('Session not found');
		}

		this.logger.info({ message: '[TestSessionService nextQuestion] question next', data: session });

		overview.currentQuestion = question;
		overview.currentQuestionIndex = overview.questions.indexOf(question) + 1;

		return overview;
	}
}
