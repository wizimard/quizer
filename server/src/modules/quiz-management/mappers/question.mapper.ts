import type { QuizQuestionModel } from '@prisma/client';
import type { JsonObject } from '@prisma/client/runtime/client';
import { QuestionEntity } from '../entities/question.entity';
import { QuestionId } from '../entities/value-object/question-id';
import { QuizId } from '../entities/value-object/quiz-id';
import { createQuestionConfigFromPayload } from '../entities/question-configs/question-config.registry';

export type TQuestionCreateOrUpdateData = Omit<QuizQuestionModel, 'id' | 'quizId'> & { config: JsonObject };

export const QuestionMapper = {
	toPersistence(entity: QuestionEntity): TQuestionCreateOrUpdateData {
		return {
			description: entity.description,
			sort_key: entity.sortKey,
			config: entity.config.toObject() as JsonObject,
		};
	},

	toDomain(questionModel: QuizQuestionModel): QuestionEntity {
		const config = createQuestionConfigFromPayload(questionModel.config as { type: string } & Record<string, unknown>);

		return new QuestionEntity(QuestionId.of(questionModel.id), QuizId.of(questionModel.quizId), questionModel.description, questionModel.sort_key, config);
	},
};
