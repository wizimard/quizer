import { BaseController } from '@shared/http/controller.base';
import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import type { IRoute } from '@shared/http/route.interface';
import { APP_TYPES } from '@app/app.types';
import { TM_TYPES } from '../test-management.types';
import { TestResponseMapper } from '../mappers/response/test-response.mapper';
import { TestInputMapper } from '../mappers/input/test-input.mapper';
import type { ILogger } from '@shared/logger';
import type { TestOverviewService } from '../interfaces/services/test-overview.service.interface';
import { AuthGuard } from '@modules/identity-access/middleware/auth.guard';
import { UserStorage } from '@modules/identity-access';
import type { IMiddleware } from '@shared/http/middleware.interface';
import { TestOwnershipGuard } from '../middlewares/test-ownership.guard';
import { TestStorage } from '../storage/test.storage';
import { parseIdParam } from '@shared/http/utils/parse-id-param';
import type { TestSessionOverviewResponse } from '../dto/http/response/test-session-overview.response-dto';
import { HttpError } from '@shared/error';
import type { TestLaunchResponse } from '../dto/http/response/test-launch.response-dto';
import type { TestLaunchResult } from '../interfaces/services/results/test-launch.result';

@injectable()
export class TestHistoryController extends BaseController {
	private readonly authGuard: AuthGuard = new AuthGuard();
	private readonly testOwnershipGuard: TestOwnershipGuard = new TestOwnershipGuard();

	constructor(
		@inject(TM_TYPES.TEST_OVERVIEW_SERVICE) private readonly testOverviewService: TestOverviewService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
		@inject(TM_TYPES.TEST_MIDDLEWARE) private readonly testMiddleware: IMiddleware,
	) {
		super();

		const routes: IRoute[] = [
			{
				url: '/',
				method: 'get',
				handler: this.getTestsHistory,
				middlewares: [this.authGuard],
			},
			{
				url: '/:testId',
				method: 'get',
				handler: this.getTestHistory,
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard],
			},
			{
				url: '/:testId/:sessionId',
				method: 'get',
				handler: this.getTestSessionOverview,
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard],
			},
		];

		this.useRoutes(routes);
	}

	async getTestHistory(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestHistoryController getTestHistory] start');

		const state = await this.testOverviewService.getTestHistory(TestInputMapper.toGetTestHistoryInput(TestStorage.get()!.id));

		const response: Array<TestLaunchResponse> = state.map((launch: TestLaunchResult) => TestResponseMapper.toTestLaunchResponse(launch));

		this.logger.info({ message: '[TestHistoryController getTestHistory] end:', data: response });

		this.ok(res, response);
	}

	async getTestSessionOverview(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestHistoryController getTestSessionOverview] start');

		const sessionId = parseIdParam(req, 'sessionId');

		if (!sessionId) {
			throw new HttpError(400, 'errors.session_id_required', '[TestHistoryController getTestSessionOverview]');
		}

		const state = await this.testOverviewService.getTestSessionOverview(TestInputMapper.toGetTestSessionOverviewInput(TestStorage.get()!.id, sessionId));

		const response: TestSessionOverviewResponse = TestResponseMapper.toTestSessionOverviewResponse(state);

		this.logger.info({ message: '[TestHistoryController getTestSessionOverview] end:', data: response });

		this.ok(res, response);
	}

	async getTestsHistory(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestHistoryController getTestsHistory] start');

		const state = await this.testOverviewService.getTestsHistory({ authorId: UserStorage.get()!.id });

		const response: Array<TestLaunchResponse> = state.map((launch: TestLaunchResult) => TestResponseMapper.toTestLaunchResponse(launch));

		this.logger.info({ message: '[TestHistoryController getTestsHistory] end:', data: response });

		this.ok(res, response);
	}
}
