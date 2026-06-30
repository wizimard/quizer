import { UserId } from '@modules/identity-access/domain/value-objects/user-id.vo';
import { inject, injectable } from 'inversify';
import { QM_TYPES } from '../../quiz-management.types';
import { QuizNotFoundError } from '../../domain/errors/quiz-not-found.error';
import type { QuizRepository } from '../../domain/repositories/quiz.repository.port';
import { QuizId } from '../../domain/value-objects/quiz-id.vo';
import type { GetQuizByIdQuery } from '../queries/get-quiz-by-id.query';
import type { QuizDto } from '../dto/quiz.dto';
import { toQuizDto } from '../mappers/to-quiz.dto';

@injectable()
export class GetQuizByIdHandler {
	constructor(@inject(QM_TYPES.QUIZ_REPOSITORY) private readonly quizRepository: QuizRepository) {}

	async execute(query: GetQuizByIdQuery): Promise<QuizDto> {
		const quiz = await this.quizRepository.findFullById(QuizId.of(query.quizId));

		if (!quiz) {
			throw new QuizNotFoundError();
		}

		quiz.assertOwnedBy(UserId.of(query.userId));

		return toQuizDto(quiz);
	}
}
