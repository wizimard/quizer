import type { QuizQuestionModel } from '@prisma/client';
import type { JsonObject } from '@prisma/client/runtime/client';
import { QuestionEntity } from '../entities/question.entity';
import { QuestionId } from '../entities/value-object/question-id';
import type { QuizId } from '../entities/value-object/quiz-id';
import { createQuestionConfigFromPayload } from '../entities/question-configs/question-config.registry';

export type TQuestionCreateOrUpdateData = Omit<QuizQuestionModel, 'id' | 'quizId'> & { config: JsonObject };

export const QuestionMapper = {
	toPersistence(entity: QuestionEntity): TQuestionCreateOrUpdateData {
		return {
			description: entity.description,
			order: entity.order,
			config: entity.config.toObject() as JsonObject,
		};
	},

	toDomain(questionModel: QuizQuestionModel, quizId: QuizId): QuestionEntity {
		const config = createQuestionConfigFromPayload(questionModel.config as { type: string } & Record<string, unknown>);

		return new QuestionEntity(QuestionId.of(questionModel.id), quizId, questionModel.description, questionModel.order, config);
	},
};
