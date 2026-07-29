import { BaseController } from '@shared/http/controller.base';
import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import { TestCreateRequestDto } from '../dto/http/request/test-create.request-dto';
import { TestUpdateRequestDto } from '../dto/http/request/test-update.request-dto';
import type { IRoute } from '@shared/http/route.interface';
import { APP_TYPES } from '@app/app.types';
import { TestSettingsUpdateRequestDto } from '../dto/http/request/test-settings-update.request-dto';
import { TestSchedulerPeriodsEditRequestDto } from '../dto/http/request/test-scheduler-periods-edit.request-dto';
import { TM_TYPES } from '../test-management.types';
import { TestStartRequestDto } from '../dto/http/request/test-start.request-dto';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { TestResponse } from '../dto/http/response/test.response-dto';
import type { TestFullResponse } from '../dto/http/response/test-full.response-dto';
import { TestMapper } from '../mappers/test.mapper';
import type { TestResult } from '../interfaces/services/results/test.result';
import { TestInputMapper } from '../mappers/input/test-input.mapper';
import type { TestSchedulerResponse } from '../dto/http/response/test-scheduler.response-dto';
import { SchedulerMapper } from '../mappers/scheduler.mapper';
import type { ILogger } from '@shared/logger';
import type { TestExecutionOverviewResponse } from '../dto/http/response/test-execution-overview.response-dto';
import type { TestService } from '../interfaces/services/test.service.interface';
import type { TestSessionService } from '../interfaces/services/test-session.service.interface';
import { AuthGuard } from '@modules/identity-access/middleware/auth.guard';
import type { IMiddleware } from '@shared/http/middleware.interface';
import { ValidateMiddleware } from '@shared/http/validate.middleware';
import { TestOwnershipGuard } from '../middlewares/test-ownership.guard';
import type { TestOverviewService } from '../interfaces/services/test-overview.service.interface';
import type { TestSettingsService } from '../interfaces/services/test-settings.service.interface';
import type { TestSchedulerService } from '../interfaces/services/test-scheduler.service.interface';
import { TestNextQuestionRequestDto } from '../dto/http/request/test-next-question-request.dto';
import { parseIdParam } from '@shared/http/utils/parse-id-param';
import type { TestSessionOverviewResponse } from '../dto/http/response/test-session-overview.response-dto';
import { HttpError } from '@shared/error';
import type { TestFinishResult } from '../interfaces/services/results/test-finish.result';
import type { TestLaunchResponse } from '../dto/http/response/test-launch.response-dto';
import type { TestLaunchResult } from '../interfaces/services/results/test-launch.result';

@injectable()
export class TestController extends BaseController {
	private readonly authGuard: AuthGuard = new AuthGuard();
	private readonly testOwnershipGuard: TestOwnershipGuard = new TestOwnershipGuard();

	constructor(
		@inject(TM_TYPES.TEST_SERVICE) private readonly testService: TestService,
		@inject(TM_TYPES.TEST_SESSION_SERVICE) private readonly testSessionService: TestSessionService,
		@inject(TM_TYPES.TEST_OVERVIEW_SERVICE) private readonly testOverviewService: TestOverviewService,
		@inject(TM_TYPES.TEST_SETTINGS_SERVICE) private readonly testSettingsService: TestSettingsService,
		@inject(TM_TYPES.TEST_SCHEDULER_SERVICE) private readonly testSchedulerService: TestSchedulerService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
		@inject(TM_TYPES.TEST_MIDDLEWARE) private readonly testMiddleware: IMiddleware,
	) {
		super();

		const routes: IRoute[] = [
			{
				url: '/history',
				method: 'get',
				handler: this.getTestsHistory,
				middlewares: [this.authGuard],
			},
			{
				url: '/:testId',
				method: 'get',
				handler: this.getTestById,
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard],
			},
			{
				url: '/',
				method: 'get',
				handler: this.getUserTest,
				middlewares: [this.authGuard],
			},
			{
				url: '/',
				method: 'post',
				handler: this.createTest,
				middlewares: [this.authGuard, new ValidateMiddleware(TestCreateRequestDto)],
			},
			{
				url: '/:testId',
				method: 'patch',
				handler: this.updateTest,
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard, new ValidateMiddleware(TestUpdateRequestDto)],
			},
			{
				url: '/:testId',
				method: 'delete',
				handler: this.deleteTest,
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard],
			},
			{
				url: '/:testId/settings',
				method: 'patch',
				handler: this.updateTestSettings,
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard, new ValidateMiddleware(TestSettingsUpdateRequestDto)],
			},
			{
				url: '/:testId/scheduler/periods',
				method: 'patch',
				handler: this.updateTestSchedulerPeriods,
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard, new ValidateMiddleware(TestSchedulerPeriodsEditRequestDto)],
			},
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
				url: '/:testId/execution-overview',
				method: 'get',
				handler: this.getTestExecutionOverview,
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard],
			},
			{
				url: '/:testId/next-question',
				method: 'post',
				handler: this.nextQuestion,
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard, new ValidateMiddleware(TestNextQuestionRequestDto)],
			},
			{
				url: '/:testId/history',
				method: 'get',
				handler: this.getTestHistory,
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard],
			},
			{
				url: '/:testId/history/:sessionId',
				method: 'get',
				handler: this.getTestSessionOverview,
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard],
			},
		];

		this.useRoutes(routes);
	}

	async getTestById(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController getTestById] start');

		const dto = await this.testService.getFullByIdAndCheckOwnership(TestInputMapper.toGetFullByIdInput(req.test!.id, req.user!.id));

		this.logger.info({ message: '[TestController getTestById] got test by id:', data: dto });

		const test: TestFullResponse = TestMapper.toFullResponse(dto);

		this.logger.info({ message: '[TestController getTestById] end:', data: test });

		this.ok(res, test);
	}

	async getUserTest(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController getUserTest] start');

		const dtos = await this.testService.getByAuthor(TestInputMapper.toGetByAuthorInput(req.user!.id));

		const tests: TestResponse[] = dtos.map((test: TestResult) => TestMapper.toResponse(test));

		this.logger.info({ message: '[TestController getUserTest] end:', data: tests });

		this.ok(res, tests);
	}

	async createTest(req: Request<object, object, TestCreateRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController createTest] start');

		const dto = await this.testService.create(TestInputMapper.toCreateInput(req.body, req.user!.id));

		const createdTest: TestFullResponse = TestMapper.toFullResponse(dto);

		this.logger.info({ message: '[TestController createTest] end:', data: createdTest });

		this.created(res, createdTest);
	}

	async updateTest(req: Request<object, object, TestUpdateRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController updateTest] start');

		const dto = await this.testService.update(TestInputMapper.toUpdateInput(req.test!, req.body));

		const updatedTest: TestFullResponse = TestMapper.toFullResponse(dto);

		this.logger.info({ message: '[TestController updateTest] end:', data: updatedTest });

		this.ok(res, updatedTest);
	}

	async deleteTest(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController deleteTest] start');

		await this.testService.delete(TestInputMapper.toDeleteInput(req.test!));

		this.logger.info('[TestController deleteTest] end');

		this.noContent(res);
	}

	async updateTestSettings(req: Request<any, object, TestSettingsUpdateRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController updateTestSettings] start');

		const dto = await this.testSettingsService.updateSettings(TestInputMapper.toUpdateSettingsInput(req.test!, req.body));

		const updatedTest: TestFullResponse = TestMapper.toFullResponse(dto);

		this.logger.info({ message: '[TestController updateTestSettings] end:', data: updatedTest });

		this.ok(res, updatedTest);
	}

	async updateTestSchedulerPeriods(req: Request<any, object, TestSchedulerPeriodsEditRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController updateTestSchedulerPeriods] start');

		const dto = await this.testSchedulerService.updateSchedulerPeriods(TestInputMapper.toUpdateSchedulerPeriodsInput(req.test!, req.body));

		const schedulerResponse: TestSchedulerResponse = SchedulerMapper.toResponse(dto);

		this.logger.info({ message: '[TestController updateTestSchedulerPeriods] end:', data: schedulerResponse });

		this.ok(res, schedulerResponse);
	}

	async startTest(req: Request<ParamsDictionary, any, TestStartRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController startTest] start');

		const isStarted: boolean = await this.testSessionService.startTest(TestInputMapper.toStartInput(req.test!, req.body));

		this.logger.info({ message: '[TestController startTest] end:', data: isStarted });

		this.ok(res, { message: isStarted ? 'Test started successfully' : 'Test not started' });
	}

	async finishTest(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController finishTest] start');

		const finishResult: TestFinishResult = await this.testSessionService.finishTest(TestInputMapper.toFinishInput(req.test!));

		this.logger.info({ message: '[TestController finishTest] send is finished response:', data: finishResult });

		this.ok(res, { message: 'Test finished successfully', session_id: finishResult.sessionId });
	}

	async getTestExecutionOverview(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController getTestExecutionOverview] start');

		const state = await this.testOverviewService.getTestExecutionOverview(TestInputMapper.toGetOverviewInput(req.test!.id, req.user!.id));

		const response: TestExecutionOverviewResponse = TestMapper.toTestExecutionOverviewResponse(state);

		this.logger.info({ message: '[TestController getTestExecutionOverview] end:', data: response });

		this.ok(res, response);
	}

	async nextQuestion(req: Request<ParamsDictionary, any, TestNextQuestionRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController nextQuestion] start');

		const state = await this.testSessionService.nextQuestion(TestInputMapper.toNextQuestionInput(req.test!.id, req.body.question_id, req.user!.id));

		const response: TestExecutionOverviewResponse = TestMapper.toTestExecutionOverviewResponse(state);

		this.logger.info({ message: '[TestController nextQuestion] end:', data: response });

		this.ok(res, response);
	}

	async getTestHistory(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController getTestHistory] start');

		const state = await this.testOverviewService.getTestHistory(TestInputMapper.toGetTestHistoryInput(req.test!.id));

		const response: Array<TestLaunchResponse> = state.map((launch: TestLaunchResult) => TestMapper.toTestLaunchResponse(launch));

		this.logger.info({ message: '[TestController getTestHistory] end:', data: response });

		this.ok(res, response);
	}

	async getTestSessionOverview(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController getTestSessionOverview] start');

		const sessionId = parseIdParam(req, 'sessionId');

		if (!sessionId) {
			throw new HttpError(400, 'errors.session_id_required', '[TestController getTestSessionOverview]');
		}

		const state = await this.testOverviewService.getTestSessionOverview(TestInputMapper.toGetTestSessionOverviewInput(req.test!.id, sessionId));

		const response: TestSessionOverviewResponse = TestMapper.toTestSessionOverviewResponse(state);

		this.logger.info({ message: '[TestController getTestSessionOverview] end:', data: response });

		this.ok(res, response);
	}

	async getTestsHistory(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController getTestsHistory] start');

		const state = await this.testOverviewService.getTestsHistory({ authorId: req.user!.id });

		const response: Array<TestLaunchResponse> = state.map((launch: TestLaunchResult) => TestMapper.toTestLaunchResponse(launch));

		this.logger.info({ message: '[TestController getTestsHistory] end:', data: response });

		this.ok(res, response);
	}
}
