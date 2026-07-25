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
	TestExecutionOverviewUserResult,
	TestExecutionOverviewAnswerResult,
	TestExecutionManualModeOverviewResult,
	TestExecutionFreeModeOverviewResult,
} from '../interfaces/services/results/test-overview-result';
import { QuestionMapper } from '../mappers/question.mapper';
import { TestMapper } from '../mappers/test.mapper';
import { TestClosedError } from '../utils/errors/test-closed.error';
import { APP_TYPES } from '@app/app.types';
import { TE_TYPES, type TestExecuteService } from '@modules/test-execution';
import type { TestSessionEntity } from '../entities/test-session.entity';
import { TestSessionRunMode } from '@prisma/client';

@injectable()
export class DefaultTestOverviewService implements TestOverviewService {
	constructor(
		@inject(TM_TYPES.TEST_REPOSITORY) private readonly testRepository: TestRepository,
		@inject(TE_TYPES.TEST_EXECUTION_SERVICE) private readonly testExecuteService: TestExecuteService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async getTestExecutionOverview(input: TestGetOverviewInput): Promise<TestExecutionOverviewResult> {
		this.logger.info({ message: '[TestSessionService getTestExecutionOverview] start', data: input });

		const test = await this.testRepository.findFullById(input.testId);

		if (!test) {
			throw new TestNotFoundError('TestSessionService getTestExecutionOverview');
		}

		if (test.authorId !== input.userId) {
			throw new TestNotOwnedError('TestSessionService getTestExecutionOverview');
		}

		const session = test.sessions[0];

		if (!session || !test.isOpen) {
			throw new TestClosedError('TestSessionService getTestExecutionOverview', 'errors.test_not_opened');
		}

		const registeredUsers: TestExecutionUser[] = await this.testExecuteService.getRegisteredSessionUsers(session.id);

		const users: TestExecutionOverviewUserResult[] = registeredUsers.map((user) => {
			const answers: TestExecutionOverviewAnswerResult[] = [];

			for (const answer of user.answers) {
				const question = test.questions.find((question) => question.id === answer.questionId);

				if (!question) {
					this.logger.error(`[TestSessionService getTestExecutionOverview] question not found, question id - ${answer.questionId}`);
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

	private getTestExecutionOverviewFreeMode(test: TestEntity, session: TestSessionEntity, users: TestExecutionOverviewUserResult[], questions: QuestionResult[]): TestExecutionFreeModeOverviewResult {
		return { test: { ...TestMapper.toFullResult(test), startedFrom: session.startedAt, runMode: session.runMode }, users, questions };
	}

	private getTestExecutionOverviewManualMode(
		test: TestEntity,
		session: TestSessionEntity,
		users: TestExecutionOverviewUserResult[],
		questions: QuestionResult[],
	): TestExecutionManualModeOverviewResult {
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
}
