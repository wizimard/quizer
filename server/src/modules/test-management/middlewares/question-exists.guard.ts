import { HttpError } from '@shared/error';
import type { IMiddleware } from '@shared/http/middleware.interface';
import { parseIdParam } from '@shared/http/utils/parse-id-param';
import type { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TM_TYPES, type QuestionRepository, QuestionEntity } from '..';

@injectable()
export class QuestionExistsGuard implements IMiddleware {
	constructor(@inject(TM_TYPES.QUESTION_REPOSITORY) private readonly questionRepository: QuestionRepository) {}

	async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
		const questionId = parseIdParam(req, 'questionId');

		const question: QuestionEntity | null = await this.questionRepository.findById(questionId);

		if (!question || !question.testId.equals(req.test!.id)) {
			throw new HttpError(404, 'errors.question_not_found', 'QuestionExistsGuard');
		}

		req.question = question;

		next();
	}
}
