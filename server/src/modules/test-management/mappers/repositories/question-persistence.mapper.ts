import type { QuestionEntity } from '@modules/test-management/entities/question.entity';
import type { TestQuestionModelCreateManyInput, TestQuestionModelUpdateArgs, TestQuestionModelUpdateInput } from '@prisma/models';
import type { JsonObject } from 'swagger-ui-express';
import { QuestionConfigMapper } from '../question-config.mapper';

export const QuestionPersistenceMapper = {
	toCreateData(entity: QuestionEntity): TestQuestionModelCreateManyInput {
		return {
			test_id: entity.testId.value,
			description: entity.description,
			config: QuestionConfigMapper.toHttp(entity.config) as JsonObject,
			sort_key: entity.sortKey,
		};
	},

	toUpdateData(entity: QuestionEntity): TestQuestionModelUpdateInput {
		return {
			description: entity.description,
			config: QuestionConfigMapper.toHttp(entity.config) as JsonObject,
		};
	},

	toUpdateOrderData(question: QuestionEntity): TestQuestionModelUpdateArgs {
		return {
			where: { id: question.id.value },
			data: { sort_key: question.sortKey },
		};
	},
};
