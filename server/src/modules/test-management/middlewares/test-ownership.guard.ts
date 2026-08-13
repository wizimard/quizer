import type { IMiddleware } from '@shared/http/middleware.interface';
import { HttpError } from '@shared/error';
import type { NextFunction, Request, Response } from 'express';
import { TestNotFoundError } from '../utils/errors/test-not-found.error';
import { UserStorage } from '@modules/identity-access';
import { TestStorage } from '../storage/test.storage';

export class TestOwnershipGuard implements IMiddleware {
	async execute(_req: Request, _res: Response, next: NextFunction): Promise<void> {
		const user = UserStorage.get();
		const test = TestStorage.get();

		if (!user) {
			return next(new HttpError(401, 'unauthorized', 'TestOwnershipGuard'));
		}

		if (!test) {
			return next(new TestNotFoundError('TestOwnershipGuard'));
		}

		try {
			test.assertOwnedBy(user.id);
			next();
		} catch (error: unknown) {
			next(error);
		}
	}
}
