import type { QuestionReadModel } from '../entities/question-read.model';
import type { QuestionExecuteDto } from '../dto/question-execute.dto';

export function toQuestionExecuteDto(question: QuestionReadModel): QuestionExecuteDto {
	const config = structuredClone(question.config.toObject()) as Record<string, unknown>;

	delete config.answer;

	return {
		id: question.id,
		quizId: question.quizId.value,
		description: question.description,
		config,
	};
}
