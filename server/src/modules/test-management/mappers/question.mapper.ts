import type { JsonObject } from '@prisma/client/runtime/client';
import { QuestionEntity } from '../entities/question.entity';
import { QuestionId } from '../entities/value-object/question-id';
import { TestId } from '../entities/value-object/test-id';
import { createQuestionConfigFromPayload } from '../entities/question-configs/question-config.registry';
import type { TestQuestionModel } from '@prisma/client';
import { QuestionConfigMapper } from './question-config.mapper';
import type { QuestionResult } from '../interfaces/services/results/question.result';
import type { CreateQuestionInput } from '../interfaces/services/input/create-question.input';
import type { UpdateQuestionInput } from '../interfaces/services/input/update-question.input';
import type { QuestionResponse } from '../dto/http/response/question.response-dto';

export type TQuestionCreateOrUpdateData = Omit<TestQuestionModel, 'id' | 'testId'> & { config: JsonObject };

export class QuestionMapper {
	static toPersistence(entity: QuestionEntity): TQuestionCreateOrUpdateData {
		return {
			test_id: entity.testId.value,
			description: entity.description,
			sort_key: entity.sortKey,
			config: QuestionConfigMapper.toHttp(entity.config) as unknown as JsonObject,
		};
	}

	static toDomain(questionModel: TestQuestionModel): QuestionEntity {
		const config = createQuestionConfigFromPayload(questionModel.config as { type: string } & Record<string, unknown>);

		return new QuestionEntity(QuestionId.of(questionModel.id), TestId.of(questionModel.test_id), questionModel.description, questionModel.sort_key, config);
	}

	static buildQuestionFromCreateInput(input: CreateQuestionInput): QuestionEntity {
		return new QuestionEntity(
			QuestionId.generate(),
			input.testId,
			input.description,
			input.sortKey,
			createQuestionConfigFromPayload(input.config as unknown as { type: string } & Record<string, unknown>),
		);
	}

	static buildQuestionFromUpdateInput(input: UpdateQuestionInput): QuestionEntity {
		return new QuestionEntity(input.id, input.testId, input.description, 0, createQuestionConfigFromPayload(input.config as unknown as { type: string } & Record<string, unknown>));
	}

	static toResult(question: QuestionEntity): QuestionResult {
		return {
			id: question.id,
			testId: question.testId,
			sortKey: question.sortKey,
			description: question.description,
			config: question.config,
		};
	}

	static toResponse(question: QuestionResult): QuestionResponse {
		return {
			id: question.id.value,
			test_id: question.testId.value,
			sort_key: question.sortKey,
			description: question.description,
			config: QuestionConfigMapper.toHttp(question.config),
		};
	}
}
