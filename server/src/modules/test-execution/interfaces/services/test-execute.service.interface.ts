import type { TestExecuteGetInput } from './input/test-execute-get.input';
import type { TestExecuteResult } from './result/test-execute.result';
import type { TestRegisterUserInput } from './input/test-register-user.input';
import type { TestRegisteredUserResult } from './result/test-registered-user.result';
import type { AnswerQuestionInput } from './input/answer-question.input';

export interface TestExecuteService {
	getTest(input: TestExecuteGetInput): Promise<TestExecuteResult>;
	registerUserForTest(input: TestRegisterUserInput): Promise<TestRegisteredUserResult>;
	answerQuestion(input: AnswerQuestionInput): Promise<TestRegisteredUserResult>;
}
