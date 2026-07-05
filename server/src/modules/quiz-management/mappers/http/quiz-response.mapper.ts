import type { IQuizResponse } from '../../interfaces/http/quiz-response.interface';
import type { QuizDto } from '../../dto/quiz.dto';

export class QuizResponseMapper {
	static toHttp(dto: QuizDto): IQuizResponse {
		return {
			id: dto.id,
			authorId: dto.authorId,
			title: dto.title,
			questions: dto.questions,
			settings: dto.settings,
			updatedAt: dto.updatedAt,
			createdAt: dto.createdAt,
		};
	}

	static toHttpList(dtos: QuizDto[]): IQuizResponse[] {
		return dtos.map(QuizResponseMapper.toHttp);
	}
}
