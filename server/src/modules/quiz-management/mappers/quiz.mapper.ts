import type { QuizAvailablePeriodModel, QuizModel, QuizQuestionModel, QuizSessionModel } from '@prisma/client';
import { UserId } from '@modules/identity-access';
import { QuizAvailablePeriod } from '../entities/quiz-available-period';
import { QuizEntity } from '../entities/quiz.entity';
import { QuizSettings } from '../entities/quiz-settings';
import { QuizId } from '../entities/value-object/quiz-id';
import { QuizSessionEntity, type QuizSessionStatus } from '../entities/quiz-session.entity';
import type { TQuizModelAll } from '../interfaces/repository/quiz.repository.interface';
import type { QuestionEntity } from '../entities/question.entity';
import { QuestionMapper } from './question.mapper';

export const QuizMapper = {
	toDomain(quizModel: TQuizModelAll | QuizModel): QuizEntity {
		const quizId = QuizId.of(quizModel.id);

		let questions: Array<QuestionEntity> = [];

		if ('questions' in quizModel) {
			questions = quizModel.questions.map((question: QuizQuestionModel) => QuestionMapper.toDomain(question));
		}

		const sessions =
			'quizSessions' in quizModel
				? quizModel.quizSessions.map((session: QuizSessionModel) => new QuizSessionEntity(session.id, quizId, session.startedAt, session.finishedAt, session.status as QuizSessionStatus))
				: [];

		if (!('quizSettings' in quizModel) || !quizModel.quizSettings) {
			return new QuizEntity(quizId, quizModel.title, UserId.of(quizModel.authorId), questions, null, quizModel.updatedAt, quizModel.createdAt, sessions);
		}

		const availablePeriods = quizModel.quizSettings.availablePeriods.map(
			(period: QuizAvailablePeriodModel) => new QuizAvailablePeriod(Number(period.id), period.quizSettingsId, period.status, period.available_from, period.available_to),
		);

		const settings = new QuizSettings(
			quizId,
			availablePeriods,
			quizModel.quizSettings.isRequiredEmail,
			quizModel.quizSettings.isRequiredFirstName,
			quizModel.quizSettings.isRequiredLastName,
			quizModel.quizSettings.isShowAnswersAfterCompletion,
		);

		return new QuizEntity(quizId, quizModel.title, UserId.of(quizModel.authorId), questions, settings, quizModel.updatedAt, quizModel.createdAt, sessions);
	},
};
