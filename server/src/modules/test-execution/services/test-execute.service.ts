import { QuestionEntity, TM_TYPES, TestEntity, TestNotFoundError, type TestRepository } from '@modules/test-management';
import { inject, injectable } from 'inversify';
import type { TestExecuteGetInput } from '../interfaces/services/input/test-execute-get.input';
import type { TestExecuteResult } from '../interfaces/services/result/test-execute.result';
import { TestExecuteMapper } from '../mappers/test-execute.mapper';
import type { TestRegisterUserInput } from '../interfaces/services/input/test-register-user.input';
import type { TestRegisteredUserResult } from '../interfaces/services/result/test-registered-user.result';
import { TestExecutionUser } from '../entities/test-execution-user';
import { TE_TYPES } from '../test-execution.types';
import type { TestRegisterRepository } from '../interfaces/repositories/test-register.repository.interface';
import { TestClosedError } from '@modules/test-management/utils/errors/test-closed.error';
import type { Answer } from '../entities/answer';
import { HttpError } from '@shared/error';
import { TestExecutionUserMapper } from '../mappers/test-execution-user.mapper';
import type { AnswerQuestionInput } from '../interfaces/services/input/answer-question.input';
import { QuestionNotFoundError } from '@modules/test-management/utils/errors/question-not-found.error';
import type { AnswerRepository } from '../interfaces/repositories/answer.repository';

@injectable()
export class TestExecuteService {
	constructor(
		@inject(TM_TYPES.TEST_REPOSITORY) private readonly testRepository: TestRepository,
		@inject(TE_TYPES.TEST_REGISTER_REPOSITORY) private readonly testRegisterRepository: TestRegisterRepository,
		@inject(TE_TYPES.ANSWER_REPOSITORY) private readonly answerRepository: AnswerRepository,
	) {}

	async getTest(input: TestExecuteGetInput): Promise<TestExecuteResult> {
		const test: TestEntity | null = await this.testRepository.findFullById(input.testId.value);

		if (!test) {
			throw new TestNotFoundError('TestExecuteService getTest');
		}

		return TestExecuteMapper.toResult(test);
	}

	async registerUserForTest(input: TestRegisterUserInput): Promise<TestRegisteredUserResult> {
		const test: TestEntity | null = await this.testRepository.findFullById(input.test.id.value);

		if (!test) {
			throw new TestNotFoundError('TestExecuteService registerUserForTest');
		}

		const sessionId: string | undefined = test.sessions[0]?.id;

		if (!sessionId) {
			throw new TestClosedError('TestExecuteService registerUserForTest');
		}

		const registeredUser: TestExecutionUser | null = await this.testRegisterRepository.findRegisteredUser(sessionId, input.firstName, input.lastName);

		if (registeredUser) {
			return TestExecutionUserMapper.toTestRegisteredUserResult(registeredUser, test, this.getCurrentQuestion(test.questions, registeredUser.answers));
		}

		const newRegisteredUser: TestExecutionUser | null = await this.testRegisterRepository.registerUserForTest(sessionId, input.firstName, input.lastName);

		if (!newRegisteredUser) {
			throw new HttpError(500, 'Error registering user for test in database', 'TestExecuteService registerUserForTest');
		}

		return TestExecutionUserMapper.toTestRegisteredUserResult(newRegisteredUser, test, test.questions[0] ?? null);
	}

	private getCurrentQuestion(questions: Array<QuestionEntity>, answers: Array<Answer>): QuestionEntity | null {
		for (const question of questions) {
			if (!answers.find((answer) => answer.questionId.equals(question.id))) {
				return question;
			}
		}

		return null;
	}

	async answerQuestion(input: AnswerQuestionInput): Promise<TestRegisteredUserResult> {
		const test: TestEntity | null = await this.testRepository.findFullById(input.testId.value);

		if (!test) {
			throw new TestNotFoundError('TestExecuteService registerUserForTest');
		}

		const sessionId: string | undefined = test.sessions[0]?.id;

		if (!sessionId) {
			throw new TestClosedError('TestExecuteService registerUserForTest');
		}
		const registeredUser: TestExecutionUser | null = await this.testRegisterRepository.findRegisteredUserById(input.userId.value);

		if (!registeredUser) {
			throw new TestNotFoundError('TestExecuteService answerQuestion');
		}

		const question: QuestionEntity | undefined = test.questions.find((question) => question.id.equals(input.answer.questionId));

		if (!question) {
			throw new QuestionNotFoundError('TestExecuteService answerQuestion');
		}

		const answer: Answer | null = await this.answerRepository.createAnswer(input.answer, registeredUser.id.value);

		if (!answer) {
			throw new HttpError(500, 'Error creating answer in database', 'TestExecuteService answerQuestion');
		}

		registeredUser.answers.push(answer);

		return TestExecutionUserMapper.toTestRegisteredUserResult(registeredUser, test, this.getCurrentQuestion(test.questions, registeredUser.answers));
	}
}
