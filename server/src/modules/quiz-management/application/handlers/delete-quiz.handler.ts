import { UserId } from '@modules/identity-access/domain/value-objects/user-id.vo';
import { inject, injectable } from 'inversify';
import { QM_TYPES } from '../../quiz-management.types';
import { QuizNotFoundError } from '../../domain/errors/quiz-not-found.error';
import type { QuizRepository } from '../../domain/repositories/quiz.repository.port';
import { QuizId } from '../../domain/value-objects/quiz-id.vo';
import type { DeleteQuizCommand } from '../commands/delete-quiz.command';

@injectable()
export class DeleteQuizHandler {
	constructor(@inject(QM_TYPES.QUIZ_REPOSITORY) private readonly quizRepository: QuizRepository) {}

	async execute(command: DeleteQuizCommand): Promise<void> {
		const quizId = QuizId.of(command.quizId);
		const quiz = await this.quizRepository.findById(quizId);

		if (!quiz) {
			throw new QuizNotFoundError();
		}

		quiz.assertOwnedBy(UserId.of(command.authorId));

		await this.quizRepository.delete(quizId);
	}
}
