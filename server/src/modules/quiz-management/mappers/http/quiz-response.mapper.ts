import type { IQuizResponse, IQuizResponseBase } from '../../interfaces/http/quiz-response.interface';
import type { QuizDto } from '../../dto/entities/quiz.entity.dto';

export class QuizResponseMapper {
	static toHttp(dto: QuizDto): IQuizResponse {
		return {
			id: dto.id,
			authorId: dto.authorId,
			status: dto.status,
			title: dto.title,
			questions: dto.questions,
			settings: dto.settings,
			updatedAt: dto.updatedAt,
			createdAt: dto.createdAt,
		};
	}

	static toHttpList(dtos: QuizDto[]): IQuizResponseBase[] {
		return dtos.map((dto) => ({
			id: dto.id,
			authorId: dto.authorId,
			status: dto.status,
			title: dto.title,
			updatedAt: dto.updatedAt,
			createdAt: dto.createdAt,
		}));
	}
}
