import { BaseController } from '@shared/http/controller.base';
import type { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { parseIdParam } from '@shared/http/utils/parse-id-param';
import { TE_TYPES } from '../test-execution.types';
import type { TestExecutionService } from '../services/test-execution.service';
import { ExecutionResponseMapper } from '../mappers/execution-response.mapper';

@injectable()
export class TestExecuteController extends BaseController {
	constructor(@inject(TE_TYPES.TEST_EXECUTION_SERVICE) private readonly TestExecutionService: TestExecutionService) {
		super();

		this.useRoutes([
			{
				url: '/test-execute/:testId',
				method: 'get',
				handler: this.getTest,
			},
			{
				url: '/test-execute/:testId/:questionId',
				method: 'get',
				handler: this.getTestQuestion,
			},
			{
				url: '/test-execute/:testId/:questionId',
				method: 'post',
				handler: this.executeTestQuestion,
			},
		]);
	}

	async getTest(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const testId = parseIdParam(req, 'testId', 'test id not defined');
		const result = await this.TestExecutionService.getTest({ testId });

		this.ok(res, ExecutionResponseMapper.toTestHttp(result));
	}

	async getTestQuestion(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const testId = parseIdParam(req, 'testId', 'test id or question id not defined');
		const questionId = parseIdParam(req, 'questionId', 'test id or question id not defined');
		const result = await this.TestExecutionService.getQuestion({ testId, questionId });

		this.ok(res, ExecutionResponseMapper.toQuestionHttp(result));
	}

	async executeTestQuestion(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const testId = parseIdParam(req, 'testId', 'test id or question id not defined');
		const questionId = parseIdParam(req, 'questionId', 'test id or question id not defined');
		const result = await this.TestExecutionService.evaluateAnswer({
			testId,
			questionId,
			answer: req.body?.answer,
		});

		this.ok(res, ExecutionResponseMapper.toEvaluationHttp(result));
	}
}
