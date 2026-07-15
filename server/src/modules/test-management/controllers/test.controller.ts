import { BaseController } from '@shared/http/controller.base';
import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import { TestCreateRequestDto } from '../dto/http/request/test-create.request-dto';
import { TestUpdateRequestDto } from '../dto/http/request/test-update.request-dto';
import type { IRoute } from '@shared/http/route.interface';
import { APP_TYPES } from '@app/app.types';
import type { IMiddlewareFactory } from '@shared/http/middleware.factory.interface';
import { TestSettingsUpdateRequestDto } from '../dto/http/request/test-settings-update.request-dto';
import { TestSchedulerPeriodsEditRequestDto } from '../dto/http/request/test-scheduler-periods-edit.request-dto';
import { TM_TYPES } from '../test-management.types';
import { TestStartRequestDto } from '../dto/http/request/test-start.request-dto';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ITestService } from '../interfaces/services/test.service.interface';
import type { ITestSessionService } from '../interfaces/services/test-session.service.interface';
import type { TestResponse } from '../dto/http/response/test.response-dto';
import type { TestFullResponse } from '../dto/http/response/test-full.response-dto';
import { TestMapper } from '../mappers/test.mapper';
import type { TestResult } from '../interfaces/services/results/test.result';
import { TestInputMapper } from '../mappers/input/test-input.mapper';
import type { TestSchedulerResponse } from '../dto/http/response/test-scheduler.response-dto';
import { SchedulerMapper } from '../mappers/scheduler.mapper';
import type { ILogger } from '@shared/logger';

@injectable()
export class TestController extends BaseController {
	constructor(
		@inject(TM_TYPES.TEST_SERVICE) private readonly testService: ITestService,
		@inject(TM_TYPES.TEST_SESSION_SERVICE) private readonly testSessionService: ITestSessionService,
		@inject(APP_TYPES.MIDDLEWARE_FACTORY) private readonly middlewareFactory: IMiddlewareFactory,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {
		super();

		const routes: IRoute[] = [
			{
				url: '/:testId',
				method: 'get',
				handler: this.getTestById,
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.testMiddleware(), this.middlewareFactory.testOwnershipGuard()],
			},
			{
				url: '/',
				method: 'get',
				handler: this.getUserTest,
				middlewares: [this.middlewareFactory.authGuard()],
			},
			{
				url: '/',
				method: 'post',
				handler: this.createTest,
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.validate(TestCreateRequestDto)],
			},
			{
				url: '/:testId',
				method: 'patch',
				handler: this.updateTest,
				middlewares: [
					this.middlewareFactory.authGuard(),
					this.middlewareFactory.testMiddleware(),
					this.middlewareFactory.testOwnershipGuard(),
					this.middlewareFactory.validate(TestUpdateRequestDto),
				],
			},
			{
				url: '/:testId',
				method: 'delete',
				handler: this.deleteTest,
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.testMiddleware(), this.middlewareFactory.testOwnershipGuard()],
			},
			{
				url: '/:testId/settings',
				method: 'patch',
				handler: this.updateTestSettings,
				middlewares: [
					this.middlewareFactory.authGuard(),
					this.middlewareFactory.testMiddleware(),
					this.middlewareFactory.testOwnershipGuard(),
					this.middlewareFactory.validate(TestSettingsUpdateRequestDto),
				],
			},
			{
				url: '/:testId/scheduler/periods',
				method: 'patch',
				handler: this.updateTestSchedulerPeriods,
				middlewares: [
					this.middlewareFactory.authGuard(),
					this.middlewareFactory.testMiddleware(),
					this.middlewareFactory.testOwnershipGuard(),
					this.middlewareFactory.validate(TestSchedulerPeriodsEditRequestDto),
				],
			},
			{
				url: '/:testId/start',
				method: 'post',
				handler: this.startTest,
				middlewares: [
					this.middlewareFactory.authGuard(),
					this.middlewareFactory.testMiddleware(),
					this.middlewareFactory.testOwnershipGuard(),
					this.middlewareFactory.validate(TestStartRequestDto),
				],
			},
			{
				url: '/:testId/finish',
				method: 'post',
				handler: this.finishTest,
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.testMiddleware(), this.middlewareFactory.testOwnershipGuard()],
			},
		];

		this.useRoutes(routes);
	}

	async getTestById(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController getTestById] start');

		const dto = await this.testService.getFullById(TestInputMapper.toGetFullByIdInput(req.test!.id.value, req.user!.id));

		this.logger.info({ message: '[TestController getTestById] got test by id:', data: dto });

		const test: TestFullResponse = TestMapper.toFullResponse(dto);

		this.logger.info({ message: '[TestController getTestById] end:', data: test });

		this.ok(res, test);
	}

	async getUserTest(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController getUserTest] start');

		const dtos = await this.testService.getByAuthor(TestInputMapper.toGetByAuthorInput(req.user!.id));

		const tests: TestResponse[] = dtos.map((dto: TestResult) => TestMapper.toResponse(dto));

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

		const dto = await this.testService.updateSettings(TestInputMapper.toUpdateSettingsInput(req.test!, req.body));

		const updatedTest: TestFullResponse = TestMapper.toFullResponse(dto);

		this.logger.info({ message: '[TestController updateTestSettings] end:', data: updatedTest });

		this.ok(res, updatedTest);
	}

	async updateTestSchedulerPeriods(req: Request<any, object, TestSchedulerPeriodsEditRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController updateTestSchedulerPeriods] start');

		const dto = await this.testService.updateSchedulerPeriods(TestInputMapper.toUpdateSchedulerPeriodsInput(req.test!, req.body));

		const schedulerResponse: TestSchedulerResponse = SchedulerMapper.toResponse(dto);

		this.logger.info({ message: '[TestController updateTestSchedulerPeriods] end:', data: schedulerResponse });

		this.ok(res, schedulerResponse);
	}

	async startTest(req: Request<ParamsDictionary, any, TestStartRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController startTest] start');

		const isStarted: boolean = await this.testSessionService.startTest(TestInputMapper.toStartInput(req.test!, req.body));

		this.logger.info({ message: '[TestController startTest] end:', data: isStarted });

		this.ok(res, { message: isStarted ? 'Test started successfully' : 'test not started' });
	}

	async finishTest(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController finishTest] start');

		const isFinished: boolean = await this.testSessionService.finishTest(TestInputMapper.toFinishInput(req.test!));

		this.logger.info({ message: '[TestController finishTest] send is finished response:', data: isFinished });

		this.ok(res, { message: isFinished ? 'Test finished successfully' : 'Test not finished' });
	}
}
