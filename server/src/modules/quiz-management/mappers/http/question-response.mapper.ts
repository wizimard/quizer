import type { QuestionDto } from '../../dto/entities/quiz.entity.dto';
import type { IQuestionResponse } from '../../interfaces/http/question-response.interface';

export class QuestionResponseMapper {
	static toHttp(dto: QuestionDto): IQuestionResponse {
		return {
			id: dto.id,
			quizId: dto.quizId,
			sortKey: dto.sortKey,
			description: dto.description,
			config: dto.config,
		};
	}
}
