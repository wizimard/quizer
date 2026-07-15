import type { QuestionEntity } from '@modules/test-management';
import { QuestionConfigMapper } from '@modules/test-management/mappers/question-config.mapper';
import type { QuestionExecuteConfigResponse, QuestionExecuteResponse } from '../dto/response/question-execute-response.dto';

export class QuestionExecuteMapper {
	static toResponse(question: QuestionEntity): QuestionExecuteResponse {
		const { answer: _answer, ...config } = QuestionConfigMapper.toHttp(question.config);

		return {
			id: question.id.value,
			test_id: question.testId.value,
			sort_key: question.sortKey,
			description: question.description,
			config: config as QuestionExecuteConfigResponse,
		};
	}
}
