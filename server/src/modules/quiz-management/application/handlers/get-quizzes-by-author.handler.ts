import { UserId } from '@modules/identity-access/domain/value-objects/user-id.vo';
import { inject, injectable } from 'inversify';
import { QM_TYPES } from '../../quiz-management.types';
import type { QuizRepository } from '../../domain/repositories/quiz.repository.port';
import type { GetQuizzesByAuthorQuery } from '../queries/get-quizzes-by-author.query';
import type { QuizDto } from '../dto/quiz.dto';
import { toQuizDto } from '../mappers/to-quiz.dto';

@injectable()
export class GetQuizzesByAuthorHandler {
	constructor(@inject(QM_TYPES.QUIZ_REPOSITORY) private readonly quizRepository: QuizRepository) {}

	async execute(query: GetQuizzesByAuthorQuery): Promise<QuizDto[]> {
		const quizzes = await this.quizRepository.findByAuthor(UserId.of(query.authorId));

		return quizzes.map(toQuizDto);
	}
}
