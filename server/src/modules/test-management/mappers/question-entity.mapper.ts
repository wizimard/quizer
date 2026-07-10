import { QuestionEntity } from '../entities/question.entity';
import { createQuestionConfigFromPayload } from '../entities/question-configs/question-config.registry';
import { QuestionId } from '../entities/value-object/question-id';
import { TestId } from '../entities/value-object/test-id';
import type { CreateQuestionInput } from '../interfaces/services/input/create-question.input';
import type { UpdateQuestionInput } from '../interfaces/services/input/update-question.input';
import { QuestionConfigMapper } from './question-config.mapper';
import type { IQuestion } from '../interfaces/entities/question.interface';

export function buildQuestionFromCreateInput(input: CreateQuestionInput): QuestionEntity {
	return new QuestionEntity(
		QuestionId.generate(),
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

export function toQuestion(question: QuestionEntity): IQuestion {
	return {
		id: question.id.value,
		testId: question.testId.value,
		sortKey: question.sortKey,
		description: question.description,
		config: QuestionConfigMapper.toPlain(question.config),
	};
}
