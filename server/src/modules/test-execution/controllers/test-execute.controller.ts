import { BaseController } from '@shared/http/controller.base';
import type { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { parseIdParam } from '@shared/http/utils/parse-id-param';
import { TestId } from '@modules/test-management';
import { TE_TYPES } from '../test-execution.types';
import type { TestExecuteService } from '../services/test-execute.service';
import { TestExecuteMapper } from '../mappers/test-execute.mapper';

@injectable()
export class TestExecuteController extends BaseController {
	constructor(@inject(TE_TYPES.TEST_EXECUTION_SERVICE) private readonly testExecutionService: TestExecuteService) {
		super();

		this.useRoutes([
			{
				url: '/:testId',
				method: 'get',
				handler: this.getTest,
			},
		]);
	}

	async getTest(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const testId = parseIdParam(req, 'testId', 'test id not defined');

		const result = await this.testExecutionService.getTest({ testId: TestId.of(testId) });

		this.ok(res, TestExecuteMapper.toResponse(result));
	}
}
