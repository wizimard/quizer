import { TestExecutionUser } from '../entities/test-execution-user';
import { AnswerMapper } from './answer.mapper';
import type { TestRegisteredUserModel } from '../interfaces/repositories/test-register.repository.interface';
import type { TestRegisteredUserResponse } from '../dto/response/test-registered-user.dto';
import type { TestRegisteredUserResult } from '../interfaces/services/result/test-registered-user.result';
import { QuestionExecuteMapper } from './question-execute.mapper';
import { type QuestionEntity, type TestEntity } from '@modules/test-management';
import type { TestRegisterRequestDto } from '../dto/request/test-register-request.dto';
import type { TestRegisterUserInput } from '../interfaces/services/input/test-register-user.input';
import type { AnswerQuestionInput } from '../interfaces/services/input/answer-question.input';
import type { QuestionAnswerRequestDto } from '../dto/request/question-answer-request.dto';
import { Answer } from '../entities/answer';
import { Helper } from '@shared/utils/helper';

export class TestExecutionUserMapper {
	static toDomain(model: TestRegisteredUserModel): TestExecutionUser {
		return new TestExecutionUser(model.id, model.first_name, model.last_name, model.created_at, model.answers.map(AnswerMapper.toDomain));
	}

	static toResponse(result: TestRegisteredUserResult): TestRegisteredUserResponse {
		return {
			id: result.id,
			first_name: result.firstName,
			last_name: result.lastName,
			current_question: result.currentQuestion ? QuestionExecuteMapper.toResponse(result.currentQuestion) : null,
			current_question_index: result.currentQuestionIndex,
			total_questions_count: result.test.questions.length,
		};
	}

	static toTestRegisterUserInput(test: TestEntity, dto: TestRegisterRequestDto): TestRegisterUserInput {
		return {
			test,
			firstName: dto.first_name,
			lastName: dto.last_name,
		};
	}

	static toTestRegisteredUserResult(user: TestExecutionUser, test: TestEntity, question: QuestionEntity | null, questionIndex: number): TestRegisteredUserResult {
		return {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			currentQuestion: question,
			currentQuestionIndex: questionIndex,
			test,
		};
	}

	static toAnswerQuestionInput(testId: string, questionId: string, dto: QuestionAnswerRequestDto): AnswerQuestionInput {
		const answer = new Answer(Helper.generateId(), questionId, dto.answer ?? '', dto.skipped ?? false);

		return {
			testId,
			userId: dto.user_id,
			answer: answer,
		};
	}
}
