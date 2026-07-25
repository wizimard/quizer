import { inject, injectable } from 'inversify';
import type { TestOverviewService } from '../interfaces/services/test-overview.service.interface';
import type { TestRepository } from '../interfaces/repository/test.repository.interface';
import { TM_TYPES } from '../test-management.types';
import type { ILogger } from '@shared/logger/logger.interface';
import type { TestExecutionUser } from '@modules/test-execution/entities/test-execution-user';
import { TestEntity, TestNotFoundError, TestNotOwnedError } from '..';
import type { TestGetOverviewInput } from '../interfaces/services/input/test-get-overview.input';
import type { QuestionResult } from '../interfaces/services/results/question.result';
import type {
	TestExecutionOverviewResult,
	TestOverviewUserResult,
	TestOverviewAnswerResult,
	TestExecutionManualModeOverviewResult,
	TestExecutionFreeModeOverviewResult,
	TestSessionOverviewResult,
} from '../interfaces/services/results/test-overview-result';
import { QuestionMapper } from '../mappers/question.mapper';
import { TestMapper } from '../mappers/test.mapper';
import { TestClosedError } from '../utils/errors/test-closed.error';
import { APP_TYPES } from '@app/app.types';
import { TE_TYPES, type TestExecuteService } from '@modules/test-execution';
import { TestSessionEntity } from '../entities/test-session.entity';
import { TestSessionRunMode } from '@prisma/client';
import type { GetTestHistoryInput } from '../interfaces/services/input/get-test-history.input';
import type { TestSessionHistoryModel, TestSessionRepository } from '../interfaces/repository/test-session.repository.interface';
import type { GetTestSessionOverviewInput } from '../interfaces/services/input/get-test-session-overview.input';
import { HttpError } from '@shared/error';
import type { GetTestsHistoryInput } from '../interfaces/services/input/get-tests-history.input';
import type { TestLaunchResult } from '../interfaces/services/results/test-launch.result';

@injectable()
export class DefaultTestOverviewService implements TestOverviewService {
	constructor(
		@inject(TM_TYPES.TEST_REPOSITORY) private readonly testRepository: TestRepository,
		@inject(TE_TYPES.TEST_EXECUTION_SERVICE) private readonly testExecuteService: TestExecuteService,
		@inject(TM_TYPES.TEST_SESSION_REPOSITORY) private readonly testSessionRepository: TestSessionRepository,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async getTestExecutionOverview(input: TestGetOverviewInput): Promise<TestExecutionOverviewResult> {
		this.logger.info({ message: '[DefaultTestOverviewService getTestExecutionOverview] start', data: input });

		const test = await this.testRepository.findFullById(input.testId);

		if (!test) {
			throw new TestNotFoundError('DefaultTestOverviewService getTestExecutionOverview');
		}

		if (test.authorId !== input.userId) {
			throw new TestNotOwnedError('DefaultTestOverviewService getTestExecutionOverview');
		}

		const session = test.sessions[0];

		if (!session || !test.isOpen) {
			throw new TestClosedError('DefaultTestOverviewService getTestExecutionOverview', 'errors.test_not_opened');
		}

		const registeredUsers: TestExecutionUser[] = await this.testExecuteService.getRegisteredSessionUsers(session.id);

		const users: TestOverviewUserResult[] = registeredUsers.map((user) => {
			const answers: TestOverviewAnswerResult[] = [];

			for (const answer of user.answers) {
				const question = test.questions.find((question) => question.id === answer.questionId);

				if (!question) {
					this.logger.error(`[DefaultTestOverviewService getTestExecutionOverview] question not found, question id - ${answer.questionId}`);
					continue;
				}

				answers.push({
					questionId: answer.questionId,
					isCorrect: answer.skipped ? false : question?.isCorrectAnswer(answer.answer),
					skipped: answer.skipped,
					value: answer.answer,
				});
			}

			return {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				startedFrom: user.startedFrom,
				answers,
			};
		});

		const questions: QuestionResult[] = test.questions.map(QuestionMapper.toResult);

		return session.runMode === TestSessionRunMode.FREE
			? this.getTestExecutionOverviewFreeMode(test, session, users, questions)
			: this.getTestExecutionOverviewManualMode(test, session, users, questions);
	}

	private getTestExecutionOverviewFreeMode(test: TestEntity, session: TestSessionEntity, users: TestOverviewUserResult[], questions: QuestionResult[]): TestExecutionFreeModeOverviewResult {
		return { test: { ...TestMapper.toFullResult(test), startedFrom: session.startedAt, runMode: session.runMode }, users, questions };
	}

	private getTestExecutionOverviewManualMode(test: TestEntity, session: TestSessionEntity, users: TestOverviewUserResult[], questions: QuestionResult[]): TestExecutionManualModeOverviewResult {
		const currentQuestion = questions.find((question) => question.id === session.currentQuestionId) ?? null;

		return {
			test: { ...TestMapper.toFullResult(test), startedFrom: session.startedAt, runMode: session.runMode },
			users,
			questions,
			currentQuestion: currentQuestion,
			currentQuestionIndex: currentQuestion ? questions.indexOf(currentQuestion) + 1 : null,
			totalQuestionsCount: questions.length,
		};
	}

	async getTestHistory(input: GetTestHistoryInput): Promise<Array<TestLaunchResult>> {
		this.logger.info({ message: '[DefaultTestOverviewService getTestHistory] start', data: input });

		const test = await this.testRepository.findFullById(input.testId);

		if (!test) {
			throw new TestNotFoundError('DefaultTestOverviewService getTestHistory');
		}

		const history: TestSessionHistoryModel[] | null = await this.testSessionRepository.getTestHistory(input.testId);

		if (!history) {
			this.logger.error(`[DefaultTestOverviewService getTestHistory] history not found, test id - ${input.testId}`);
			return [];
		}

		const launches: TestLaunchResult[] = [];

		for (const session of history) {
			if (!session.started_at || !session.finished_at) {
				continue;
			}

			launches.push({
				testId: session.test.id,
				testTitle: session.test.title,
				sessionId: session.id,
				runMode: session.run_mode,
				userRegisteredCount: session._count.registered_users,
				startedAt: session.started_at,
				finishedAt: session.finished_at,
			});
		}

		return launches;
	}

	async getTestSessionOverview(input: GetTestSessionOverviewInput): Promise<TestSessionOverviewResult> {
		this.logger.info({ message: '[DefaultTestOverviewService getTestSessionOverview] start', data: input });

		const test = await this.testRepository.findFullById(input.testId);

		if (!test) {
			throw new TestNotFoundError('DefaultTestOverviewService getTestSessionOverview');
		}

		const sessionModel = await this.testSessionRepository.findById(input.sessionId, input.testId);

		if (!sessionModel) {
			throw new HttpError(404, 'errors.session_not_found', '[DefaultTestOverviewService getTestSessionOverview]');
		}

		// TODO
		const session = new TestSessionEntity(
			sessionModel.id,
			test.id,
			sessionModel.status,
			sessionModel.run_mode,
			sessionModel.started_at,
			sessionModel.finished_at,
			sessionModel.start_by,
			sessionModel.current_question_id,
		);

		if (!session.finishedAt) {
			throw new HttpError(400, 'errors.session_not_finished', '[DefaultTestOverviewService getTestSessionOverview]');
		}

		const registeredUsers: TestExecutionUser[] = await this.testExecuteService.getRegisteredSessionUsers(session.id);

		const users: TestOverviewUserResult[] = registeredUsers.map((user) => {
			const answers: TestOverviewAnswerResult[] = [];

			for (const answer of user.answers) {
				const question = test.questions.find((question) => question.id === answer.questionId);

				if (!question) {
					this.logger.error(`[DefaultTestOverviewService getTestSessionOverview] question not found, question id - ${answer.questionId}`);
					continue;
				}

				answers.push({
					questionId: answer.questionId,
					isCorrect: answer.skipped ? false : question?.isCorrectAnswer(answer.answer),
					skipped: answer.skipped,
					value: answer.answer,
				});
			}

			return {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				startedFrom: user.startedFrom,
				answers,
			};
		});

		const questions: QuestionResult[] = test.questions.map(QuestionMapper.toResult);

		return { test: { ...TestMapper.toFullResult(test), startedFrom: session.startedAt, runMode: session.runMode, finishedAt: session.finishedAt }, users, questions };
	}

	async getTestsHistory(input: GetTestsHistoryInput): Promise<Array<TestLaunchResult>> {
		this.logger.info({ message: '[DefaultTestOverviewService getTestsHistory] start', data: input });

		const history: TestSessionHistoryModel[] | null = await this.testSessionRepository.getTestsHistory(input.authorId);

		if (!history) {
			this.logger.error(`[DefaultTestOverviewService getTestsHistory] history not found`);
			return [];
		}

		const launches: Array<TestLaunchResult> = [];

		for (const session of history) {
			if (!session.started_at || !session.finished_at) {
				continue;
			}

			launches.push({
				testId: session.test.id,
				testTitle: session.test.title,
				sessionId: session.id,
				runMode: session.run_mode,
				userRegisteredCount: session._count.registered_users,
				startedAt: session.started_at,
				finishedAt: session.finished_at,
			});
		}

		return launches;
	}
}
