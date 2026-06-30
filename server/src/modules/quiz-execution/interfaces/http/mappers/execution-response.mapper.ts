import type { EvaluationResultDto } from '../../../application/dto/evaluation-result.dto';
import type { ExecutableQuizDto } from '../../../application/dto/executable-quiz.dto';
import type { QuestionExecuteDto } from '../../../application/dto/question-execute.dto';
import type { IAnswerEvaluationResponse } from '../types/answer-evaluation-response.interface';
import type { IQuizExecuteResponse } from '../types/quiz-execute-response.interface';
import type { IQuestionResponse } from '../types/questions-response.interface';

export class ExecutionResponseMapper {
	static toQuizHttp(dto: ExecutableQuizDto): IQuizExecuteResponse {
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
			quizId: dto.quizId,
			order: dto.order,
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
