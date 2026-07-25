import type { JsonObject } from '@prisma/client/runtime/client';
import { QuestionEntity } from '../entities/question.entity';
import { createQuestionConfigFromPayload } from '../entities/question-configs/question-config.registry';
import type { TestQuestionModel } from '@prisma/client';
import { QuestionConfigMapper } from './question-config.mapper';
import type { QuestionResult } from '../interfaces/services/results/question.result';
import type { CreateQuestionInput } from '../interfaces/services/input/create-question.input';
import type { UpdateQuestionInput } from '../interfaces/services/input/update-question.input';
import type { QuestionResponse } from '../dto/http/response/question.response-dto';
import { Helper } from '@shared/utils/helper';

export type TQuestionCreateOrUpdateData = Omit<TestQuestionModel, 'id' | 'testId'> & { config: JsonObject };

export class QuestionMapper {
	static toPersistence(entity: QuestionEntity): TQuestionCreateOrUpdateData {
		return {
			test_id: entity.testId,
			description: entity.description,
			sort_key: entity.sortKey,
			config: QuestionConfigMapper.toHttp(entity.config) as unknown as JsonObject,
		};
	}

	static toDomain(questionModel: TestQuestionModel): QuestionEntity {
		const config = createQuestionConfigFromPayload(questionModel.config as { type: string } & Record<string, unknown>);

		return new QuestionEntity(questionModel.id, questionModel.test_id, questionModel.description, questionModel.sort_key, config);
	}

	static buildQuestionFromCreateInput(input: CreateQuestionInput, sortKey: number): QuestionEntity {
		return new QuestionEntity(
			Helper.generateId(),
			input.testId,
			input.description,
			sortKey,
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
			id: question.id,
			test_id: question.testId,
			sort_key: question.sortKey,
			description: question.description,
			config: QuestionConfigMapper.toHttp(question.config),
		};
	}
}
