import { BaseController } from '@shared/http/controller.base';
import type { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { parseIdParam } from '@shared/http/utils/parse-id-param';
import { TM_TYPES, TestId } from '@modules/test-management';
import { TE_TYPES } from '../test-execution.types';
import type { TestExecuteService } from '../services/test-execute.service';
import { TestExecuteMapper } from '../mappers/test-execute.mapper';
import { MiddlewareFactory } from '@shared/http/middleware.factory';
import { APP_TYPES } from '@app/app.types';
import { TestRegisterRequestDto } from '../dto/request/test-register-request.dto';
import type { IMiddleware } from '@shared/http/middleware.interface';
import { TestExecutionUserMapper } from '../mappers/test-execution-user.mapper';
import { TestOpenGuard } from '../middlewares/test-open.guard';
import { QuestionAnswerRequestDto } from '../dto/request/question-answer-request.dto';

@injectable()
export class TestExecuteController extends BaseController {
	private readonly testOpenGuard = new TestOpenGuard();

	constructor(
		@inject(TE_TYPES.TEST_EXECUTION_SERVICE) private readonly testExecutionService: TestExecuteService,
		@inject(APP_TYPES.MIDDLEWARE_FACTORY) private readonly middlewareFactory: MiddlewareFactory,
		@inject(TM_TYPES.TEST_MIDDLEWARE) private readonly testMiddleware: IMiddleware,
	) {
		super();

		this.useRoutes([
			{
				url: '/:testId',
				method: 'get',
				handler: this.getTest,
			},
			{
				url: '/:testId/register',
				method: 'post',
				handler: this.registerUserForTest,
				middlewares: [this.middlewareFactory.validate(TestRegisterRequestDto), this.testMiddleware, this.testOpenGuard],
			},
			{
				url: '/:testId/:questionId/answer',
				method: 'post',
				handler: this.answerQuestion,
				middlewares: [this.middlewareFactory.validate(QuestionAnswerRequestDto), this.testMiddleware, this.testOpenGuard],
			},
		]);
	}

	async getTest(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const testId = parseIdParam(req, 'testId');

		const result = await this.testExecutionService.getTest({ testId: TestId.of(testId) });

		this.ok(res, TestExecuteMapper.toResponse(result));
	}

	async registerUserForTest(req: Request<unknown, unknown, TestRegisterRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		const result = await this.testExecutionService.registerUserForTest(TestExecutionUserMapper.toTestRegisterUserInput(req.test!, req.body));

		this.ok(res, TestExecutionUserMapper.toResponse(result));
	}

	async answerQuestion(req: Request<any, unknown, QuestionAnswerRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		const questionId = parseIdParam(req, 'questionId');

		const result = await this.testExecutionService.answerQuestion(TestExecutionUserMapper.toAnswerQuestionInput(req.test!.id.value, questionId, req.body));

		this.ok(res, TestExecutionUserMapper.toResponse(result));
	}
}
