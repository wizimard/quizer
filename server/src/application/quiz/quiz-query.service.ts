import { inject, injectable } from 'inversify';
import { HttpError } from '@error';
import { QUIZ_TYPES } from '@composition/quiz.types';
import type { QuizRepository } from '@domain/quiz/ports/quiz.repository.port';
import type { IQuizEntity } from '@domain/quiz/quiz.entity.interface';
import type { IQuizQueryService } from './quiz-query.service.interface';

@injectable()
export class QuizQueryService implements IQuizQueryService {
	constructor(@inject(QUIZ_TYPES.QUIZ_REPOSITORY) private readonly quizRepository: QuizRepository) {}

	async getById(id: string): Promise<IQuizEntity> {
		const quiz = await this.quizRepository.findById(id);

		if (!quiz) {
			throw new HttpError(404, 'quiz_not_found', 'QuizQueryService');
		}

		return quiz;
	}

	async getFullById(id: string): Promise<IQuizEntity> {
		const quiz = await this.quizRepository.findFullById(id);

		if (!quiz) {
			throw new HttpError(404, 'quiz_not_found', 'QuizQueryService');
		}

		return quiz;
	}
}
