import type { JsonObject } from '@prisma/client/runtime/client';
import { QuestionEntity } from '../entities/question.entity';
import { QuestionId } from '../entities/value-object/question-id';
import { TestId } from '../entities/value-object/test-id';
import { createQuestionConfigFromPayload } from '../entities/question-configs/question-config.registry';
import type { TestQuestionModel } from '@prisma/client';

export type TQuestionCreateOrUpdateData = Omit<TestQuestionModel, 'id' | 'testId'> & { config: JsonObject };

export const QuestionMapper = {
	toPersistence(entity: QuestionEntity): TQuestionCreateOrUpdateData {
		return {
			test_id: entity.testId.value,
			description: entity.description,
			sort_key: entity.sortKey,
			config: entity.config.toObject() as JsonObject,
		};
	},

	toDomain(questionModel: TestQuestionModel): QuestionEntity {
		const config = createQuestionConfigFromPayload(questionModel.config as { type: string } & Record<string, unknown>);

		return new QuestionEntity(QuestionId.of(questionModel.id), TestId.of(questionModel.test_id), questionModel.description, questionModel.sort_key, config);
	},
};
