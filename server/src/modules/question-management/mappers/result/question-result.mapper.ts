import type { QuestionEntity } from '@modules/test-management/entities/question.entity';
import type { QuestionResponse } from '@modules/test-management/dto/http/response/question.response-dto';
import type { QuestionResult } from '@modules/test-management/interfaces/services/results/question.result';
import { toUploadUrl } from '@shared/storage';

export class QuestionResultMapper {
	static toResult(question: QuestionEntity): QuestionResult {
		return {
			id: question.id,
			testId: question.testId,
			sortKey: question.sortKey,
			description: question.description,
			score: question.score ?? 1,
			image: toUploadUrl(question.image),
			config: question.config,
		};
	}
}
