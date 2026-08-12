import type { QuestionResponse } from '@modules/test-management/dto/http/response/question.response-dto';
import type { QuestionResult } from '@modules/test-management/interfaces/services/results/question.result';
import { QuestionConfigMapper } from '../question-config.mapper';

export class QuestionResponseMapper {
	static toResponse(question: QuestionResult): QuestionResponse {
		return {
			id: question.id,
			test_id: question.testId,
			sort_key: question.sortKey,
			description: question.description,
			score: question.score,
			image: question.image,
			config: QuestionConfigMapper.toHttp(question.config),
		};
	}
}
