import { QuestionEntity, TM_TYPES, TestEntity, TestNotFoundError, type TestService } from '@modules/test-management';
import { inject, injectable } from 'inversify';
import type { TestExecuteGetInput } from '../interfaces/services/input/test-execute-get.input';
import type { TestExecuteResult } from '../interfaces/services/result/test-execute.result';
import { TestExecuteMapper } from '../mappers/test-execute.mapper';
import type { TestRegisterUserInput } from '../interfaces/services/input/test-register-user.input';
import type { TestRegisteredUserResult } from '../interfaces/services/result/test-registered-user.result';
import { TestExecutionUser } from '../entities/test-execution-user';
import { TE_TYPES } from '../test-execution.types';
import type { TestRegisterRepository } from '../interfaces/repositories/test-register.repository.interface';
import type { Answer } from '../entities/answer';
import { HttpError } from '@shared/error';
import { TestExecutionUserMapper } from '../mappers/test-execution-user.mapper';
import type { AnswerQuestionInput } from '../interfaces/services/input/answer-question.input';
import type { AnswerRepository } from '../interfaces/repositories/answer.repository';
import type { TestExecuteService } from '../interfaces/services/test-execute.service.interface';
import { QuestionNotFoundError } from '@modules/test-management/utils/errors/question-not-found.error'; // TODO
import { TestClosedError } from '@modules/test-management/utils/errors/test-closed.error'; // TODO
import { TestSessionRunMode } from '@prisma/client';
import type { TestSessionEntity } from '@modules/test-management';
import type { ILogger } from '@shared/logger';
import { APP_TYPES } from '@app/app.types';

@injectable()
export class DefaultTestExecuteService implements TestExecuteService {
	constructor(
		@inject(TE_TYPES.TEST_REGISTER_REPOSITORY) private readonly testRegisterRepository: TestRegisterRepository,
		@inject(TM_TYPES.TEST_SERVICE) private readonly testService: TestService,
		@inject(TE_TYPES.ANSWER_REPOSITORY) private readonly answerRepository: AnswerRepository,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async getTest(input: TestExecuteGetInput): Promise<TestExecuteResult> {
		const test: TestEntity | null = await this.testService.getFullById(input.testId);

		if (!test) {
			throw new TestNotFoundError('TestExecuteService getTest');
		}

		return TestExecuteMapper.toResult(test);
	}

	async registerUserForTest(input: TestRegisterUserInput): Promise<TestRegisteredUserResult> {
		const test: TestEntity | null = await this.testService.getFullById(input.test.id);

		if (!test) {
			throw new TestNotFoundError('TestExecuteService registerUserForTest');
		}

		const session: TestSessionEntity | undefined = test.sessions[0];

		if (!session) {
			throw new TestClosedError('TestExecuteService registerUserForTest');
		}

		const registeredUser: TestExecutionUser | null = await this.testRegisterRepository.findRegisteredUser(session.id, input.firstName, input.lastName);

		if (registeredUser) {
			const { question, questionIndex } = this.getCurrentQuestion(session, test.questions, registeredUser.answers);
			return TestExecutionUserMapper.toTestRegisteredUserResult(registeredUser, test, question, questionIndex);
		}

		const newRegisteredUser: TestExecutionUser | null = await this.testRegisterRepository.registerUserForTest(session.id, input.firstName, input.lastName);

		if (!newRegisteredUser) {
			throw new HttpError(500, 'Error registering user for test in database', 'TestExecuteService registerUserForTest');
		}

		const { question, questionIndex } = this.getCurrentQuestion(session, test.questions, newRegisteredUser.answers);

		return TestExecutionUserMapper.toTestRegisteredUserResult(newRegisteredUser, test, question, questionIndex);
	}

	private getCurrentQuestion(session: TestSessionEntity, questions: Array<QuestionEntity>, answers: Array<Answer>): { question: QuestionEntity | null; questionIndex: number } {
		if (session.runMode === TestSessionRunMode.MANUAL) {
			this.logger.info(`[DefaultTestExecuteService getCurrentQuestion] session ${session.id} run mode is manual`);

			if (!session.currentQuestionId) {
				this.logger.info(`[DefaultTestExecuteService getCurrentQuestion] no current question for session ${session.id}`);
				return { question: null, questionIndex: 0 };
			}

			const questionIndex = questions.findIndex((question) => question.id === session.currentQuestionId);

			if (questionIndex === -1) {
				this.logger.error(`[DefaultTestExecuteService getCurrentQuestion] current question not found ${session.currentQuestionId} for session ${session.id}`);
				return { question: null, questionIndex: 0 };
			}

			if (answers.find((answer) => answer.questionId === questions[questionIndex]!.id)) {
				this.logger.info(`[DefaultTestExecuteService getCurrentQuestion] current question already answered ${questions[questionIndex]!.id} for session ${session.id}`);
				return { question: null, questionIndex: questionIndex + 1 };
			}

			this.logger.info(`[DefaultTestExecuteService getCurrentQuestion] found current question ${questions[questionIndex]!.id} for session ${session.id}`);

			return { question: questions[questionIndex]!, questionIndex: questionIndex + 1 };
		}

		this.logger.info(`[DefaultTestExecuteService getCurrentQuestion] session ${session.id} run mode is free`);

		for (const question of questions) {
			if (!answers.find((answer) => answer.questionId === question.id)) {
				this.logger.info(`[DefaultTestExecuteService getCurrentQuestion] found current question ${question.id} for session ${session.id}`);
				return { question: question, questionIndex: questions.findIndex((question) => question.id === question.id) + 1 };
			}
		}

		this.logger.info(`[DefaultTestExecuteService getCurrentQuestion] user answered all questions for session ${session.id}`);

		return { question: null, questionIndex: questions.length };
	}

	// TODO: move to separate service
	async answerQuestion(input: AnswerQuestionInput): Promise<TestRegisteredUserResult> {
		const test: TestEntity | null = await this.testService.getFullById(input.testId);

		if (!test) {
			throw new TestNotFoundError('TestExecuteService registerUserForTest');
		}

		const session: TestSessionEntity | undefined = test.sessions[0];

		if (!session) {
			throw new TestClosedError('TestExecuteService registerUserForTest');
		}
		const registeredUser: TestExecutionUser | null = await this.testRegisterRepository.findRegisteredUserById(input.userId);

		if (!registeredUser) {
			throw new TestNotFoundError('TestExecuteService answerQuestion');
		}

		const question: QuestionEntity | undefined = test.questions.find((question) => question.id === input.answer.questionId);

		if (!question) {
			throw new QuestionNotFoundError('TestExecuteService answerQuestion');
		}

		const answer: Answer | null = await this.answerRepository.createAnswer(input.answer, registeredUser.id);

		if (!answer) {
			throw new HttpError(500, 'Error creating answer in database', 'TestExecuteService answerQuestion');
		}

		registeredUser.answers.push(answer);

		const { question: userQuestion, questionIndex: userQuestionIndex } = this.getCurrentQuestion(session, test.questions, registeredUser.answers);

		return TestExecutionUserMapper.toTestRegisteredUserResult(registeredUser, test, userQuestion, userQuestionIndex);
	}

	async getRegisteredSessionUsers(sessionId: string): Promise<Array<TestExecutionUser>> {
		return this.testRegisterRepository.findSessionRegisteredUsers(sessionId);
	}
}
