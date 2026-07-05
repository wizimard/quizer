import type { QuizSessionModel } from '@prisma/client';
import type { ExecutableQuiz } from '../entities/executable-quiz';
import type { TQuizModelWithSessions } from '../interfaces/repository/quiz.repository.interface';

export const ExecutableQuizMapper = {
	toReadModel(row: TQuizModelWithSessions): ExecutableQuiz {
		const currentDate = new Date();
		const isOpen = row.quizSessions.some((session: QuizSessionModel) => session.status === 'ACTIVE' && (!session.finishedAt || session.finishedAt > currentDate));

		return {
			id: row.id,
			authorId: row.authorId,
			title: row.title,
			isOpen,
		};
	},
};
