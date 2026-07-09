import type { EvaluationResultDto } from '../dto/evaluation-result.dto';
import type { ExecutableTestDto } from '../dto/executable-test.dto';
import type { QuestionExecuteDto } from '../dto/question-execute.dto';
import type { IAnswerEvaluationResponse } from '../interfaces/answer-evaluation-response.interface';
import type { ITestExecuteResponse } from '../interfaces/test-execute-response.interface';
import type { IQuestionResponse } from '../interfaces/questions-response.interface';

export class ExecutionResponseMapper {
	static toTestHttp(dto: ExecutableTestDto): ITestExecuteResponse {
		return {
			id: dto.id,
			authorId: dto.authorId,
			title: dto.title,
			isOpen: dto.isOpen,
		};
	}

	static toQuestionHttp(dto: QuestionExecuteDto): IQuestionResponse {
		return {
			id: dto.id,
			testId: dto.testId,
			description: dto.description,
			config: dto.config,
		};
	}

	static toEvaluationHttp(dto: EvaluationResultDto): IAnswerEvaluationResponse {
		return {
			correct: dto.correct,
		};
	}
}
