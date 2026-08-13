import { TestNotFoundError, TestStorage, type TestEntity } from '@modules/test-management';
import { TestClosedError } from '@modules/test-management/utils/errors/test-closed.error'; // TODO
import type { IMiddleware } from '@shared/http/middleware.interface';
import type { NextFunction, Request, Response } from 'express';

export class TestOpenGuard implements IMiddleware {
	execute(_req: Request, _res: Response, next: NextFunction): void {
		const test: TestEntity | undefined = TestStorage.get();

		if (!test) {
			return next(new TestNotFoundError('TestOpenGuard.execute'));
		}

		if (!test.isOpen) {
			return next(new TestClosedError('TestOpenGuard.execute'));
		}

		next();
	}
}
