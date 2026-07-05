import type { IMiddleware } from '@shared/http/middleware.interface';
import { parseIdParam } from '@shared/http/utils/parse-id-param';
import type { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { QM_TYPES } from '../quiz-management.types';
import type { QuizRepository } from '../interfaces/repository/quiz.repository.interface';
import { QuizId } from '../entities/value-object/quiz-id';

@injectable()
export class QuizMiddleware implements IMiddleware {
	constructor(
		@inject(QM_TYPES.QUIZ_REPOSITORY) private readonly quizRepository: QuizRepository,
		private readonly paramName: string = 'quizId',
	) {}

	async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
		try {
			const quizId = parseIdParam(req, this.paramName);
			const quiz = await this.quizRepository.findFullById(QuizId.of(quizId));

			if (quiz) {
				req.quiz = quiz;
			}

			next();
		} catch (error: unknown) {
			next(error);
		}
	}
}
