import type { IMiddleware } from '@shared/http/middleware.interface';
import { HttpError } from '@shared/error';
import type { NextFunction, Request, Response } from 'express';
import { TestNotFoundError } from '../utils/errors/test-not-found.error';

export class TestOwnershipGuard implements IMiddleware {
	execute(req: Request, _res: Response, next: NextFunction): void {
		if (!req.user) {
			return next(new HttpError(401, 'unauthorized', 'TestOwnershipGuard'));
		}

		if (!req.test) {
			return next(new TestNotFoundError('TestOwnershipGuard'));
		}

		try {
			req.test.assertOwnedBy(req.user.id);
			next();
		} catch (error: unknown) {
			next(error);
		}
	}
}
