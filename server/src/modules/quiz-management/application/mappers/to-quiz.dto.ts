import type { QuizEntity } from '../../domain/entities/quiz.entity';
import type { QuizDto } from '../dto/quiz.dto';
import type { QuizSettingsDto } from '../dto/quiz-settings.dto';

const emptySettings = (): QuizSettingsDto => ({
	availablePeriods: [],
	isRequiredEmail: false,
	isRequiredFirstName: false,
	isRequiredLastName: false,
	isShowAnswersAfterCompletion: false,
});

export function toQuizDto(quiz: QuizEntity): QuizDto {
	const settings: QuizSettingsDto = quiz.settings
		? {
				availablePeriods: quiz.settings.availablePeriods.map((period) => ({
					id: period.id,
					quizSettingsId: period.quizSettingsId,
					available_from: period.available_from,
					available_to: period.available_to ?? null,
				})),
				isRequiredEmail: quiz.settings.isRequiredEmail,
				isRequiredFirstName: quiz.settings.isRequiredFirstName,
				isRequiredLastName: quiz.settings.isRequiredLastName,
				isShowAnswersAfterCompletion: quiz.settings.isShowAnswersAfterCompletion,
			}
		: emptySettings();

	return {
		id: quiz.id.value,
		authorId: quiz.authorId.value,
		title: quiz.title,
		questions: quiz.questions.map((question) => ({
			id: question.id,
			quizId: question.quizId.value,
			description: question.description,
			order: question.order,
			config: question.config.toObject(),
		})),
		settings,
		updatedAt: quiz.updatedAt,
		createdAt: quiz.createdAt,
	};
}
