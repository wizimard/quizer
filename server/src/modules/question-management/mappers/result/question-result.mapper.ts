import type { QuestionEntity } from '@modules/test-management/entities/question.entity';
import type { QuestionResult } from '@modules/test-management/interfaces/services/results/question.result';

export class QuestionResultMapper {
	static toResult(question: QuestionEntity): QuestionResult {
		return {
			id: question.id,
			testId: question.testId,
			sortKey: question.sortKey,
			description: question.description,
			config: question.config,
		};
	}
}
