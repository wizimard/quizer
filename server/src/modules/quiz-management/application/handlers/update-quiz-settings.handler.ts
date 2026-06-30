import { UserId } from '@modules/identity-access/domain/value-objects/user-id.vo';
import { inject, injectable } from 'inversify';
import { QM_TYPES } from '../../quiz-management.types';
import { QuizNotFoundError } from '../../domain/errors/quiz-not-found.error';
import { QuizSettings } from '../../domain/entities/quiz-settings';
import type { QuizRepository } from '../../domain/repositories/quiz.repository.port';
import { QuizId } from '../../domain/value-objects/quiz-id.vo';
import type { UpdateQuizSettingsCommand } from '../commands/update-quiz-settings.command';
import type { QuizDto } from '../dto/quiz.dto';
import { toQuizDto } from '../mappers/to-quiz.dto';

@injectable()
export class UpdateQuizSettingsHandler {
	constructor(@inject(QM_TYPES.QUIZ_REPOSITORY) private readonly quizRepository: QuizRepository) {}

	async execute(command: UpdateQuizSettingsCommand): Promise<QuizDto> {
		const quizId = QuizId.of(command.quizId);
		const quiz = await this.quizRepository.findFullById(quizId);

		if (!quiz) {
			throw new QuizNotFoundError();
		}

		quiz.assertOwnedBy(UserId.of(command.authorId));

		const updateSettingsData = QuizSettings.buildUpdateData(
			quiz.id,
			{
				isRequiredEmail: command.isRequiredEmail,
				isRequiredFirstName: command.isRequiredFirstName,
				isRequiredLastName: command.isRequiredLastName,
				isShowAnswersAfterCompletion: command.isShowAnswersAfterCompletion,
			},
			command.availablePeriods,
		);

		const updatedQuiz = await this.quizRepository.updateSettings(quizId, updateSettingsData);

		return toQuizDto(updatedQuiz);
	}
}
