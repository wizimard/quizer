import type { QuizEntity } from '../entities/quiz.entity';
import type { QuizDto } from '../dto/entities/quiz.entity.dto';
import type { QuizSettingsDto } from '../dto/entities/quiz-settings.entity.dto';

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
					status: period.status,
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
		status: quiz.status,
		questions: quiz.questions.map((question, index) => ({
			id: question.id.value,
			quizId: question.quizId.value,
			sortKey: question.sortKey,
			description: question.description,
			config: question.config.toObject(),
		})),
		settings,
		updatedAt: quiz.updatedAt,
		createdAt: quiz.createdAt,
	};
}
