import type { QuizQuestionModel } from '@prisma/client';
import type { JsonObject } from '@prisma/client/runtime/client';
import { QuestionEntity } from '../../../domain/entities/question.entity';
import type { QuizId } from '../../../domain/value-objects/quiz-id.vo';
import { createQuestionConfigFromPayload } from '../../../domain/value-objects/question-configs/question-config.registry';

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

		return new QuestionEntity(questionModel.id, quizId, questionModel.description, questionModel.order, config);
	},
};
