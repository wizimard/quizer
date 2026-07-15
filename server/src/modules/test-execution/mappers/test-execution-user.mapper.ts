import { TestExecutionUser } from '../entities/test-execution-user';
import { TestExecutionUserId } from '../entities/value-object/test-execution-user-id';
import { AnswerMapper } from './answer.mapper';
import type { TestRegisteredUserModel } from '../interfaces/repositories/test-register.repository.interface';
import type { TestRegisteredUserResponse } from '../dto/response/test-registered-user.dto';
import type { TestRegisteredUserResult } from '../interfaces/services/result/test-registered-user.result';
import { QuestionExecuteMapper } from './question-execute.mapper';
import { QuestionId, type QuestionEntity, type TestEntity, TestId } from '@modules/test-management';
import type { TestRegisterRequestDto } from '../dto/request/test-register-request.dto';
import type { TestRegisterUserInput } from '../interfaces/services/input/test-register-user.input';
import type { AnswerQuestionInput } from '../interfaces/services/input/answer-question.input';
import type { QuestionAnswerRequestDto } from '../dto/request/question-answer-request.dto';
import { Answer } from '../entities/answer';
import { AnswerId } from '../entities/value-object/answer-id';

export class TestExecutionUserMapper {
	static toDomain(model: TestRegisteredUserModel): TestExecutionUser {
		return new TestExecutionUser(TestExecutionUserId.of(model.id), model.first_name, model.last_name, model.answers.map(AnswerMapper.toDomain));
	}

	static toResponse(user: TestRegisteredUserResult): TestRegisteredUserResponse {
		return {
			id: user.id.value,
			first_name: user.firstName,
			last_name: user.lastName,
			current_question: user.currentQuestion ? QuestionExecuteMapper.toResponse(user.currentQuestion) : null,
			current_question_index: user.currentQuestion ? user.test.questions.findIndex((question) => question.id.equals(user.currentQuestion!.id)) : 0,
			total_questions_count: user.test.questions.length,
		};
	}

	static toTestRegisterUserInput(test: TestEntity, dto: TestRegisterRequestDto): TestRegisterUserInput {
		return {
			test,
			firstName: dto.first_name,
			lastName: dto.last_name,
		};
	}

	static toTestRegisteredUserResult(user: TestExecutionUser, test: TestEntity, question: QuestionEntity | null): TestRegisteredUserResult {
		return {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			currentQuestion: question,
			test,
		};
	}

	static toAnswerQuestionInput(testId: string, questionId: string, dto: QuestionAnswerRequestDto): AnswerQuestionInput {
		const answer = new Answer(AnswerId.generate(), QuestionId.of(questionId), dto.answer ?? '', dto.skipped ?? false);

		return {
			testId: TestId.of(testId),
			userId: TestExecutionUserId.of(dto.user_id),
			answer: answer,
		};
	}
}
