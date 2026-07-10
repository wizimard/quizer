import { BaseController } from '@shared/http/controller.base';
import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import { TestCreateDto } from '../dto/http/test-create.dto';
import { TestUpdateDto } from '../dto/http/test-update.dto';
import type { ITestResponse, ITestResponseBase } from '../interfaces/http/test-response.interface';
import type { IRoute } from '@shared/http/route.interface';
import { APP_TYPES } from '@app/app.types';
import type { IMiddlewareFactory } from '@shared/http/middleware.factory.interface';
import { TestSettingsUpdateDto } from '../dto/http/test-settings-update.dto';
import { TestSchedulerPeriodsEditDto } from '../dto/http/test-scheduler-periods-edit.dto';
import { TM_TYPES } from '../test-management.types';
import { TestRequestMapper } from '../mappers/http/test-request.mapper';
import { TestResponseMapper } from '../mappers/http/test-response.mapper';
import { TestStartDto } from '../dto/http/test-start.dto';
import type { ParamsDictionary } from 'express-serve-static-core';
import { toTest } from '../mappers/to-test.dto';
import type { ITestSchedulerResponse } from '../interfaces/http/scheduler-response.interface';
import { TestSchedulerPeriodMapper } from '../mappers/http/test-scheduler.mapper';
import type { ITestService } from '../interfaces/services/test.service.interface';
import type { ITestSessionService } from '../interfaces/services/test-session.service.interface';

@injectable()
export class TestController extends BaseController {
	constructor(
		@inject(TM_TYPES.TEST_SERVICE) private readonly testService: ITestService,
		@inject(TM_TYPES.TEST_SESSION_SERVICE) private readonly testSessionService: ITestSessionService,
		@inject(APP_TYPES.MIDDLEWARE_FACTORY) private readonly middlewareFactory: IMiddlewareFactory,
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
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.validate(TestCreateDto)],
			},
			{
				url: '/:testId',
				method: 'patch',
				handler: this.updateTest,
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.testMiddleware(), this.middlewareFactory.testOwnershipGuard(), this.middlewareFactory.validate(TestUpdateDto)],
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
					this.middlewareFactory.validate(TestSettingsUpdateDto),
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
					this.middlewareFactory.validate(TestSchedulerPeriodsEditDto),
				],
			},
			{
				url: '/:testId/start',
				method: 'post',
				handler: this.startTest,
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.testMiddleware(), this.middlewareFactory.testOwnershipGuard(), this.middlewareFactory.validate(TestStartDto)],
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
		const dto = toTest(req.test!);
		const Test: ITestResponse = TestResponseMapper.toHttp(dto);

		this.ok(res, Test);
	}

	async getUserTest(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const dtos = await this.testService.getByAuthor({ authorId: req.user!.id });
		const Testes: ITestResponseBase[] = TestResponseMapper.toHttpList(dtos);

		this.ok(res, Testes);
	}

	async createTest(req: Request<object, object, TestCreateDto>, res: Response, _next: NextFunction): Promise<void> {
		const dto = await this.testService.create(TestRequestMapper.toCreateInput(req.body, req.user!.id));
		const createdTest: ITestResponse = TestResponseMapper.toHttp(dto);

		this.created(res, createdTest);
	}

	async updateTest(req: Request<object, object, TestUpdateDto>, res: Response, _next: NextFunction): Promise<void> {
		const dto = await this.testService.update(TestRequestMapper.toUpdateInput(req.test!, req.body));
		const updatedTest: ITestResponse = TestResponseMapper.toHttp(dto);

		this.ok(res, updatedTest);
	}

	async deleteTest(req: Request, res: Response, _next: NextFunction): Promise<void> {
		await this.testService.delete(TestRequestMapper.toDeleteInput(req.test!));

		this.noContent(res);
	}

	async updateTestSettings(req: Request<any, object, TestSettingsUpdateDto>, res: Response, _next: NextFunction): Promise<void> {
		const dto = await this.testService.updateSettings(TestRequestMapper.toUpdateSettingsInput(req.test!, req.body));
		const updatedTest: ITestResponse = TestResponseMapper.toHttp(dto);

		this.ok(res, updatedTest);
	}

	async updateTestSchedulerPeriods(req: Request<any, object, TestSchedulerPeriodsEditDto>, res: Response, _next: NextFunction): Promise<void> {
		const dto = await this.testService.updateSchedulerPeriods(TestRequestMapper.toUpdateSchedulerPeriodsInput(req.test!, req.body));
		const schedulerResponse: ITestSchedulerResponse = TestSchedulerPeriodMapper.toHttp(dto);

		this.ok(res, schedulerResponse);
	}

	async startTest(req: Request<ParamsDictionary, any, TestStartDto>, res: Response, _next: NextFunction): Promise<void> {
		await this.testSessionService.startTest(TestRequestMapper.toStartCommand(req.test!, req.body));

		this.ok(res, { message: 'Test started successfully' });
	}

	async finishTest(req: Request, res: Response, _next: NextFunction): Promise<void> {
		await this.testSessionService.finishTest(TestRequestMapper.toFinishCommand(req.test!));

		this.ok(res, { message: 'Test finished successfully' });
	}
}
