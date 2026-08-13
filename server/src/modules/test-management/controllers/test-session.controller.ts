import { BaseController } from '@shared/http/controller.base';
import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import type { IRoute } from '@shared/http/route.interface';
import { APP_TYPES } from '@app/app.types';
import { TM_TYPES } from '../test-management.types';
import { TestStartRequestDto } from '../dto/http/request/test-start.request-dto';
import type { ParamsDictionary } from 'express-serve-static-core';
import { TestResponseMapper } from '../mappers/response/test-response.mapper';
import { TestInputMapper } from '../mappers/input/test-input.mapper';
import type { ILogger } from '@shared/logger';
import type { TestExecutionOverviewResponse } from '../dto/http/response/test-execution-overview.response-dto';
import type { TestSessionService } from '../interfaces/services/test-session.service.interface';
import type { TestOverviewService } from '../interfaces/services/test-overview.service.interface';
import { AuthGuard } from '@modules/identity-access/middleware/auth.guard';
import { UserStorage } from '@modules/identity-access';
import type { IMiddleware } from '@shared/http/middleware.interface';
import { ValidateMiddleware } from '@shared/http/validate.middleware';
import { TestOwnershipGuard } from '../middlewares/test-ownership.guard';
import { TestStorage } from '../storage/test.storage';
import { TestNextQuestionRequestDto } from '../dto/http/request/test-next-question-request.dto';
import type { TestFinishResult } from '../interfaces/services/results/test-finish.result';

@injectable()
export class TestSessionController extends BaseController {
	private readonly authGuard: AuthGuard = new AuthGuard();
	private readonly testOwnershipGuard: TestOwnershipGuard = new TestOwnershipGuard();

	constructor(
		@inject(TM_TYPES.TEST_SESSION_SERVICE) private readonly testSessionService: TestSessionService,
		@inject(TM_TYPES.TEST_OVERVIEW_SERVICE) private readonly testOverviewService: TestOverviewService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
		@inject(TM_TYPES.TEST_MIDDLEWARE) private readonly testMiddleware: IMiddleware,
	) {
		super();

		const routes: IRoute[] = [
			{
				url: '/:testId/start',
				method: 'post',
				handler: this.startTest,
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard, new ValidateMiddleware(TestStartRequestDto)],
			},
			{
				url: '/:testId/finish',
				method: 'post',
				handler: this.finishTest,
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard],
			},
			{
				url: '/:testId/next-question',
				method: 'post',
				handler: this.nextQuestion,
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard, new ValidateMiddleware(TestNextQuestionRequestDto)],
			},
			{
				url: '/:testId/overview',
				method: 'get',
				handler: this.getTestExecutionOverview,
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard],
			},
		];

		this.useRoutes(routes);
	}

	async startTest(req: Request<ParamsDictionary, any, TestStartRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestSessionController startTest] start');

		const isStarted: boolean = await this.testSessionService.startTest(TestInputMapper.toStartInput(TestStorage.get()!, req.body));

		this.logger.info({ message: '[TestSessionController startTest] end:', data: isStarted });

		this.ok(res, { message: isStarted ? 'Test started successfully' : 'Test not started' });
	}

	async finishTest(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestSessionController finishTest] start');

		const finishResult: TestFinishResult = await this.testSessionService.finishTest(TestInputMapper.toFinishInput(TestStorage.get()!));

		this.logger.info({ message: '[TestSessionController finishTest] send is finished response:', data: finishResult });

		this.ok(res, { message: 'Test finished successfully', session_id: finishResult.sessionId });
	}

	async nextQuestion(req: Request<ParamsDictionary, any, TestNextQuestionRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestSessionController nextQuestion] start');

		const state = await this.testSessionService.nextQuestion(TestInputMapper.toNextQuestionInput(TestStorage.get()!.id, req.body.question_id, UserStorage.get()!.id));

		const response: TestExecutionOverviewResponse = TestResponseMapper.toTestExecutionOverviewResponse(state);

		this.logger.info({ message: '[TestSessionController nextQuestion] end:', data: response });

		this.ok(res, response);
	}

	async getTestExecutionOverview(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestSessionController getTestExecutionOverview] start');

		const state = await this.testOverviewService.getTestExecutionOverview(TestInputMapper.toGetOverviewInput(TestStorage.get()!.id, UserStorage.get()!.id));

		const response: TestExecutionOverviewResponse = TestResponseMapper.toTestExecutionOverviewResponse(state);

		this.logger.info({ message: '[TestSessionController getTestExecutionOverview] end:', data: response });

		this.ok(res, response);
	}
}
