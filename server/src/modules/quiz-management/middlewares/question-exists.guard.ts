import { HttpError } from '@shared/error';
import type { IMiddleware } from '@shared/http/middleware.interface';
import { parseIdParam } from '@shared/http/utils/parse-id-param';
import type { NextFunction, Request, Response } from 'express';

export class QuestionExistsGuard implements IMiddleware {
	execute(req: Request, _res: Response, next: NextFunction): void {
		const questionId = parseIdParam(req, 'questionId');

		if (!req.quiz!.questions.find((question) => question.id.value === questionId)) {
			throw new HttpError(404, 'errors.question_not_found', 'QuestionExistsGuard');
		}

		next();
	}
}
