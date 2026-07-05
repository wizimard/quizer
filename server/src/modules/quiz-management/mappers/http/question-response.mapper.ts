import type { QuestionDto } from '../../dto/quiz.dto';
import type { IQuestionResponse } from '../../interfaces/http/question-response.interface';

export class QuestionResponseMapper {
	static toHttp(dto: QuestionDto): IQuestionResponse {
		return {
			id: dto.id,
			quizId: dto.quizId,
			order: dto.order,
			description: dto.description,
			config: dto.config,
		};
	}
}
