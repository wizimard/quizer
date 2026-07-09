import type { IMiddleware } from '@shared/http/middleware.interface';
import { parseIdParam } from '@shared/http/utils/parse-id-param';
import type { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TM_TYPES } from '../test-management.types';
import { TestId } from '../entities/value-object/test-id';
import type { TestRepository } from '../interfaces/repository/test.repository.interface';

@injectable()
export class TestMiddleware implements IMiddleware {
	constructor(
		@inject(TM_TYPES.TEST_REPOSITORY) private readonly testRepository: TestRepository,
		private readonly paramName: string = 'testId',
	) {}

	async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
		try {
			const testId = parseIdParam(req, this.paramName);
			const test = await this.testRepository.findFullById(TestId.of(testId));

			if (test) {
				req.test = test;
			}

			next();
		} catch (error: unknown) {
			next(error);
		}
	}
}
