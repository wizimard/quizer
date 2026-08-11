import { QuestionEntity } from '@modules/test-management/entities/question.entity';
import { createQuestionConfigFromPayload } from '@modules/test-management/entities/question-configs/question-config.registry';
import { QuestionConfigMapper } from '../question-config.mapper';
import type { TestQuestionModel } from '@prisma/client';
import type { TestQuestionModelCreateManyInput, TestQuestionModelUpdateArgs, TestQuestionModelUpdateInput } from '@prisma/models';
import type { JsonObject } from 'swagger-ui-express';

export class QuestionPersistenceMapper {
	static toDomain(questionModel: TestQuestionModel): QuestionEntity {
		const config = createQuestionConfigFromPayload(questionModel.config as { type: string } & Record<string, unknown>);

		return new QuestionEntity(questionModel.id, questionModel.test_id, questionModel.description, questionModel.sort_key, config);
	}

	static toCreateData(entity: QuestionEntity): TestQuestionModelCreateManyInput {
		return {
			test_id: entity.testId,
			description: entity.description,
			config: QuestionConfigMapper.toHttp(entity.config) as JsonObject,
			sort_key: entity.sortKey,
		};
	}

	static toUpdateData(entity: QuestionEntity): TestQuestionModelUpdateInput {
		return {
			description: entity.description,
			config: QuestionConfigMapper.toHttp(entity.config) as JsonObject,
		};
	}

	static toUpdateOrderData(question: QuestionEntity): TestQuestionModelUpdateArgs {
		return {
			where: { id: question.id },
			data: { sort_key: question.sortKey },
		};
	}
}
