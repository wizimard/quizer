import type { QuestionEntity } from '@modules/test-management';
import type { QuestionExecuteResponse } from '../dto/response/question-execute-response.dto';

export class QuestionExecuteMapper {
	static toResponse(question: QuestionEntity): QuestionExecuteResponse {
		const questionExecute = {
			id: question.id,
			test_id: question.testId,
			sort_key: question.sortKey,
			description: question.description,
			config: question.config,
		};

		delete questionExecute.config.answer;

		return questionExecute as unknown as QuestionExecuteResponse;
	}
}
