import type { IQuestion } from '../../interfaces/entities/question.interface';
import type { IQuestionResponse } from '../../interfaces/http/question-response.interface';

export class QuestionResponseMapper {
	static toHttp(question: IQuestion): IQuestionResponse {
		return {
			id: question.id,
			testId: question.testId,
			sortKey: question.sortKey,
			description: question.description,
			config: question.config,
		};
	}
}
