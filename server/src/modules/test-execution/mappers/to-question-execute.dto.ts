import type { QuestionReadModel } from '../entities/question-read.model';
import type { QuestionExecuteDto } from '../dto/question-execute.dto';
import { QuestionConfigMapper } from '@modules/test-management/mappers/question-config.mapper';

export function toQuestionExecuteDto(question: QuestionReadModel): QuestionExecuteDto {
	const config = structuredClone(QuestionConfigMapper.toHttp(question.config)) as any;

	delete config.answer;

	return {
		id: question.id,
		testId: question.testId.value,
		description: question.description,
		config,
	};
}
