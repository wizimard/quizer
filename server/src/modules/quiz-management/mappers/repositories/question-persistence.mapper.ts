import type { QuestionEntity } from '@modules/quiz-management/entities/question.entity';
import type { QuestionId } from '@modules/quiz-management/entities/value-object/question-id';
import type { QuizId } from '@modules/quiz-management/entities/value-object/quiz-id';
import type { QuizQuestionModelCreateManyInput, QuizQuestionModelUpdateArgs, QuizQuestionModelUpdateInput } from '@prisma/models';
import type { JsonObject } from 'swagger-ui-express';

export const QuestionPersistenceMapper = {
	toCreateData(entity: QuestionEntity): QuizQuestionModelCreateManyInput {
		return {
			quizId: entity.quizId.value,
			description: entity.description,
			config: entity.config.toObject() as JsonObject,
			sort_key: entity.sortKey,
		};
	},

	toUpdateData(entity: QuestionEntity): QuizQuestionModelUpdateInput {
		return {
			description: entity.description,
			config: entity.config.toObject() as JsonObject,
		};
	},

	toUpdateOrderData(question: QuestionEntity): QuizQuestionModelUpdateArgs {
		return {
			where: { id: question.id.value },
			data: { sort_key: question.sortKey },
		};
	},

	toDeleteData(id: QuestionId, quizId: QuizId) {
		return {
			where: { id: id.value, quizId: quizId.value },
		};
	},
};
