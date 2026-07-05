import type { QuestionEntity } from '@modules/quiz-management/entities/question.entity';
import type { QuizQuestionModelCreateManyInput, QuizQuestionModelUpdateInput } from '@prisma/models';
import type { JsonObject } from 'swagger-ui-express';

export const QuestionPersistenceMapper = {
	toCreateData(entity: QuestionEntity): QuizQuestionModelCreateManyInput {
		return {
			quizId: entity.quizId.value,
			description: entity.description,
			order: entity.order,
			config: entity.config.toObject() as JsonObject,
		};
	},

	toUpdateData(entity: QuestionEntity): QuizQuestionModelUpdateInput {
		return {
			description: entity.description,
			order: entity.order,
			config: entity.config.toObject() as JsonObject,
		};
	},
};
