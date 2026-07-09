import { QuestionEntity } from '../entities/question.entity';
import { createQuestionConfigFromPayload } from '../entities/question-configs/question-config.registry';
import { QuestionId } from '../entities/value-object/question-id';
import type { CreateQuestionInput, UpdateQuestionInput } from '../interfaces/input/question.input';
import type { QuestionDto } from '../dto/entities/test.entity.dto';
import { TestId } from '../entities/value-object/test-id';

const NEW_QUESTION_ID = QuestionId.of('new');

export function buildQuestionFromCreateInput(input: CreateQuestionInput): QuestionEntity {
	return new QuestionEntity(
		NEW_QUESTION_ID,
		TestId.of(input.testId),
		input.description,
		input.sortKey,
		createQuestionConfigFromPayload(input.config as unknown as { type: string } & Record<string, unknown>),
	);
}

export function buildQuestionFromUpdateInput(input: UpdateQuestionInput): QuestionEntity {
	return new QuestionEntity(
		QuestionId.of(input.id),
		TestId.of(input.testId),
		input.description,
		0,
		createQuestionConfigFromPayload(input.config as unknown as { type: string } & Record<string, unknown>),
	);
}

export function toQuestionDto(question: QuestionEntity): QuestionDto {
	return {
		id: question.id.value,
		testId: question.testId.value,
		sortKey: question.sortKey,
		description: question.description,
		config: question.config.toObject(),
	};
}
