import type { QuizQuestionModel } from '@prisma/client';
import { createQuestionConfigFromPayload } from '@modules/quiz-management/entities/question-configs/question-config.registry';
import { QuizId } from '@modules/quiz-management/entities/value-object/quiz-id';
import type { QuestionReadModel } from '../entities/question-read.model';

export class QuestionReadMapper {
	static toReadModel(row: QuizQuestionModel): QuestionReadModel {
		const config = createQuestionConfigFromPayload(row.config as { type: string } & Record<string, unknown>);

		return {
			id: row.id,
			quizId: QuizId.of(row.quizId),
			description: row.description,
			config,
		};
	}
}
