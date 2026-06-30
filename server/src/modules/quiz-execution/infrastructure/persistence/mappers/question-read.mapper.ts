import type { QuizModel, QuizQuestionModel } from '@prisma/client';
import { createQuestionConfigFromPayload } from '@modules/quiz-management/domain/value-objects/question-configs/question-config.registry';
import { QuizId } from '@modules/quiz-management/domain/value-objects/quiz-id.vo';
import type { QuestionReadModel } from '../../../domain/read-models/question-read.model';
import type { ExecutableQuiz } from '../../../domain/read-models/executable-quiz.read-model';

export class QuestionReadMapper {
	static toReadModel(row: QuizQuestionModel): QuestionReadModel {
		const config = createQuestionConfigFromPayload(row.config as { type: string } & Record<string, unknown>);

		return {
			id: row.id,
			quizId: QuizId.of(row.quizId),
			order: row.order,
			description: row.description,
			config,
		};
	}

	static toExecutableQuiz(row: QuizModel): ExecutableQuiz {
		return {
			id: row.id,
			authorId: row.authorId,
			title: row.title,
			isOpen: false,
		};
	}
}
