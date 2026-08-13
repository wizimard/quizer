import type { AnswerQuestionInput } from './input/answer-question.input';
import type { TestRegisteredUserResult } from './result/test-registered-user.result';

export interface TestAnswerService {
	answerQuestion(input: AnswerQuestionInput): Promise<TestRegisteredUserResult>;
}
