import type { QuestionEntity } from '@modules/test-management/entities/question.entity';
import type { TestQuestionModelCreateManyInput, TestQuestionModelUpdateArgs, TestQuestionModelUpdateInput } from '@prisma/models';
import type { JsonObject } from 'swagger-ui-express';

export const QuestionPersistenceMapper = {
	toCreateData(entity: QuestionEntity): TestQuestionModelCreateManyInput {
		return {
			test_id: entity.testId.value,
			description: entity.description,
			config: entity.config.toObject() as JsonObject,
			sort_key: entity.sortKey,
		};
	},

	toUpdateData(entity: QuestionEntity): TestQuestionModelUpdateInput {
		return {
			description: entity.description,
			config: entity.config.toObject() as JsonObject,
		};
	},

	toUpdateOrderData(question: QuestionEntity): TestQuestionModelUpdateArgs {
		return {
			where: { id: question.id.value },
			data: { sort_key: question.sortKey },
		};
	},
};
