import { UserId } from '@modules/identity-access';
import type { IMiddleware } from '@shared/http/middleware.interface';
import { HttpError } from '@shared/error';
import type { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';
import { QuizNotFoundError } from '../utils/errors/quiz-not-found.error';

@injectable()
export class QuizOwnershipGuard implements IMiddleware {
	execute(req: Request, _res: Response, next: NextFunction): void {
		if (!req.user) {
			return next(new HttpError(401, 'unauthorized', 'QuizOwnershipGuard'));
		}

		if (!req.quiz) {
			return next(new QuizNotFoundError('QuizOwnershipGuard'));
		}

		try {
			req.quiz.assertOwnedBy(UserId.of(req.user.id));
			next();
		} catch (error: unknown) {
			next(error);
		}
	}
}
