import type { ITestResponse, ITestResponseBase } from '../../interfaces/http/test-response.interface';
import type { TestDto } from '../../dto/entities/test.entity.dto';

export class TestResponseMapper {
	static toHttp(dto: TestDto): ITestResponse {
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

	static toHttpList(dtos: TestDto[]): ITestResponseBase[] {
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
