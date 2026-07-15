import { TestNotFoundError, type TestEntity } from '@modules/test-management';
import { TestClosedError } from '@modules/test-management/utils/errors/test-closed.error';
import type { IMiddleware } from '@shared/http/middleware.interface';
import type { NextFunction, Request, Response } from 'express';

export class TestOpenGuard implements IMiddleware {
	execute(req: Request, _res: Response, next: NextFunction): void {
		const test: TestEntity | undefined = req.test;

		if (!test) {
			return next(new TestNotFoundError('TestOpenGuard.execute'));
		}

		if (!test.isOpen) {
			return next(new TestClosedError('TestOpenGuard.execute'));
		}

		next();
	}
}
