import { inject, injectable } from 'inversify';
import { QM_TYPES } from '@modules/quiz-management/quiz-management.types';
import { QuizNotFoundError } from '@modules/quiz-management/domain/errors/quiz-not-found.error';
import type { QuizRepository } from '@modules/quiz-management/domain/repositories/quiz.repository.port';
import { QuizId } from '@modules/quiz-management/domain/value-objects/quiz-id.vo';
import type { GetQuizForExecutionQuery } from '../queries/get-quiz-for-execution.query';
import type { ExecutableQuizDto } from '../dto/executable-quiz.dto';
import { toExecutableQuizDto } from '../mappers/to-executable-quiz.dto';

@injectable()
export class GetQuizForExecutionHandler {
	constructor(@inject(QM_TYPES.QUIZ_REPOSITORY) private readonly quizRepository: QuizRepository) {}

	async execute(query: GetQuizForExecutionQuery): Promise<ExecutableQuizDto> {
		const quiz = await this.quizRepository.findFullById(QuizId.of(query.quizId));

		if (!quiz) {
			throw new QuizNotFoundError();
		}

		return toExecutableQuizDto(quiz);
	}
}
