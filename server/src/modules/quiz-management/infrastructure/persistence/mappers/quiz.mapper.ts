import type { QuizModel } from '@prisma/client';
import { UserId } from '@modules/identity-access/domain/value-objects/user-id.vo';
import { QuizAvailablePeriod } from '../../../domain/entities/quiz-available-period';
import { QuizEntity } from '../../../domain/entities/quiz.entity';
import { QuizSettings } from '../../../domain/entities/quiz-settings';
import { QuizId } from '../../../domain/value-objects/quiz-id.vo';
import type { TQuizModelAll } from '../prisma-quiz.types';
import { QuestionMapper } from './question.mapper';

export const QuizMapper = {
	toDomain(quizModel: TQuizModelAll | QuizModel): QuizEntity {
		const quizId = QuizId.of(quizModel.id);
		const questions = 'questions' in quizModel ? quizModel.questions.map((question) => QuestionMapper.toDomain(question, quizId)) : [];

		if (!('quizSettings' in quizModel) || !quizModel.quizSettings) {
			return new QuizEntity(quizId, quizModel.title, UserId.of(quizModel.authorId), questions, null, quizModel.updatedAt, quizModel.createdAt);
		}

		const availablePeriods = quizModel.quizSettings.availablePeriods.map((period) => new QuizAvailablePeriod(Number(period.id), period.quizSettingsId, period.available_from, period.available_to));

		const settings = new QuizSettings(
			quizId,
			availablePeriods,
			quizModel.quizSettings.isRequiredEmail,
			quizModel.quizSettings.isRequiredFirstName,
			quizModel.quizSettings.isRequiredLastName,
			quizModel.quizSettings.isShowAnswersAfterCompletion,
		);

		return new QuizEntity(quizId, quizModel.title, UserId.of(quizModel.authorId), questions, settings, quizModel.updatedAt, quizModel.createdAt);
	},
};
