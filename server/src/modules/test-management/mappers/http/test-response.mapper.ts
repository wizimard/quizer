import type { ITestResponse, ITestResponseBase } from '../../interfaces/http/test-response.interface';
import type { ITest } from '../../interfaces/entities/test.interface';

export class TestResponseMapper {
	static toHttp(dto: ITest): ITestResponse {
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

	static toHttpList(dtos: ITest[]): ITestResponseBase[] {
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
