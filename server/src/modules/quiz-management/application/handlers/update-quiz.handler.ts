import { UserId } from '@modules/identity-access/domain/value-objects/user-id.vo';
import { inject, injectable } from 'inversify';
import { QM_TYPES } from '../../quiz-management.types';
import { QuizNotFoundError } from '../../domain/errors/quiz-not-found.error';
import { QuizValidationFailedError } from '../../domain/errors/quiz-validation-failed.error';
import type { QuizRepository } from '../../domain/repositories/quiz.repository.port';
import { QuizId } from '../../domain/value-objects/quiz-id.vo';
import type { UpdateQuizCommand } from '../commands/update-quiz.command';
import type { QuizDto } from '../dto/quiz.dto';
import { buildQuestionsFromInputs } from '../mappers/quiz-entity.mapper';
import { toQuizDto } from '../mappers/to-quiz.dto';

@injectable()
export class UpdateQuizHandler {
	constructor(@inject(QM_TYPES.QUIZ_REPOSITORY) private readonly quizRepository: QuizRepository) {}

	async execute(command: UpdateQuizCommand): Promise<QuizDto> {
		const quizId = QuizId.of(command.id);
		const quiz = await this.quizRepository.findFullById(quizId);

		if (!quiz) {
			throw new QuizNotFoundError();
		}

		quiz.assertOwnedBy(UserId.of(command.authorId));

		const addQuestions = command.add ? buildQuestionsFromInputs(command.add, quiz.id) : [];
		const updateQuestions = command.update ? buildQuestionsFromInputs(command.update, quiz.id) : [];
		const deleteIds = command.delete ?? [];

		if (command.title) {
			quiz.updateTitle(command.title);
		}

		const validationData = quiz.validateUpdate(deleteIds, addQuestions, updateQuestions);

		if (validationData.errors.length || validationData.questionsErrors.length) {
			throw new QuizValidationFailedError(validationData);
		}

		const updatedQuiz = await this.quizRepository.update(quiz, addQuestions, updateQuestions, deleteIds);

		return toQuizDto(updatedQuiz);
	}
}
