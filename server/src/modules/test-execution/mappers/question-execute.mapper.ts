import type { QuestionEntity } from '@modules/test-management';
import type { QuestionExecuteResponse } from '../dto/response/question-execute-response.dto';

export class QuestionExecuteMapper {
	static toResponse(question: QuestionEntity): QuestionExecuteResponse {
		const questionConfig = question.config as unknown as QuestionExecuteResponse['config'];
		let config: QuestionExecuteResponse['config'];

		if ('options' in questionConfig) {
			config = {
				type: questionConfig.type,
				options: questionConfig.options.map((option) => ({
					id: option.id,
					value: option.value,
				})),
			};
		} else {
			config = {
				type: 'input',
			};
		}

		return {
			id: question.id,
			test_id: question.testId,
			sort_key: question.sortKey,
			description: question.description,
			config: config as QuestionExecuteResponse['config'],
		};
	}
}
