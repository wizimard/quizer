import { QuestionEntity, TM_TYPES, TestEntity, TestNotFoundError, type TestService } from '@modules/test-management';
import { inject, injectable } from 'inversify';
import type { TestRegisteredUserResult } from '../interfaces/services/result/test-registered-user.result';
import { TestExecutionUser } from '../entities/test-execution-user';
import { TE_TYPES } from '../test-execution.types';
import type { TestRegisterRepository } from '../interfaces/repositories/test-register.repository.interface';
import type { Answer } from '../entities/answer';
import { HttpError } from '@shared/error';
import { TestExecutionUserMapper } from '../mappers/test-execution-user.mapper';
import type { AnswerQuestionInput } from '../interfaces/services/input/answer-question.input';
import type { AnswerRepository } from '../interfaces/repositories/answer.repository';
import type { TestAnswerService } from '../interfaces/services/test-answer.service.interface';
import { QuestionNotFoundError } from '@modules/test-management/utils/errors/question-not-found.error'; // TODO
import { TestClosedError } from '@modules/test-management/utils/errors/test-closed.error'; // TODO
import type { TestSessionEntity } from '@modules/test-management';
import type { ILogger } from '@shared/logger';
import { APP_TYPES } from '@app/app.types';
import { getCurrentQuestion } from '../utils/get-current-question';

@injectable()
export class DefaultTestAnswerService implements TestAnswerService {
	constructor(
		@inject(TE_TYPES.TEST_REGISTER_REPOSITORY) private readonly testRegisterRepository: TestRegisterRepository,
		@inject(TM_TYPES.TEST_SERVICE) private readonly testService: TestService,
		@inject(TE_TYPES.ANSWER_REPOSITORY) private readonly answerRepository: AnswerRepository,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async answerQuestion(input: AnswerQuestionInput): Promise<TestRegisteredUserResult> {
		const test: TestEntity | null = await this.testService.getFullById(input.testId);

		if (!test) {
			throw new TestNotFoundError('DefaultTestAnswerService answerQuestion');
		}

		const session: TestSessionEntity | undefined = test.sessions[0];

		if (!session) {
			throw new TestClosedError('DefaultTestAnswerService answerQuestion');
		}
		const registeredUser: TestExecutionUser | null = await this.testRegisterRepository.findRegisteredUserById(input.userId);

		if (!registeredUser) {
			throw new TestNotFoundError('DefaultTestAnswerService answerQuestion');
		}

		const question: QuestionEntity | undefined = test.questions.find((question) => question.id === input.answer.questionId);

		if (!question) {
			throw new QuestionNotFoundError('DefaultTestAnswerService answerQuestion');
		}

		const answer: Answer | null = await this.answerRepository.createAnswer(input.answer, registeredUser.id);

		if (!answer) {
			throw new HttpError(500, 'Error creating answer in database', 'DefaultTestAnswerService answerQuestion');
		}

		registeredUser.answers.push(answer);

		const { question: userQuestion, questionIndex: userQuestionIndex } = getCurrentQuestion(session, test.questions, registeredUser.answers, this.logger);

		return TestExecutionUserMapper.toTestRegisteredUserResult(registeredUser, test, userQuestion, userQuestionIndex);
	}
}
