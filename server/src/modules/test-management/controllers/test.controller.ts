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
import type { TestResponse } from '../dto/http/response/test.response-dto';
import type { TestFullResponse } from '../dto/http/response/test-full.response-dto';
import { TestResponseMapper } from '../mappers/response/test-response.mapper';
import type { TestResult } from '../interfaces/services/results/test.result';
import { TestInputMapper } from '../mappers/input/test-input.mapper';
import type { TestSchedulerResponse } from '../dto/http/response/test-scheduler.response-dto';
import { SchedulerResponseMapper } from '../mappers/response/scheduler-response.mapper';
import type { ILogger } from '@shared/logger';
import type { TestService } from '../interfaces/services/test.service.interface';
import { AuthGuard } from '@modules/identity-access/middleware/auth.guard';
import { UserStorage } from '@modules/identity-access';
import type { IMiddleware } from '@shared/http/middleware.interface';
import { ValidateMiddleware } from '@shared/http/validate.middleware';
import { TestOwnershipGuard } from '../middlewares/test-ownership.guard';
import { TestStorage } from '../storage/test.storage';
import type { TestSettingsService } from '../interfaces/services/test-settings.service.interface';
import type { TestSchedulerService } from '../interfaces/services/test-scheduler.service.interface';

@injectable()
export class TestController extends BaseController {
	private readonly authGuard: AuthGuard = new AuthGuard();
	private readonly testOwnershipGuard: TestOwnershipGuard = new TestOwnershipGuard();

	constructor(
		@inject(TM_TYPES.TEST_SERVICE) private readonly testService: TestService,
		@inject(TM_TYPES.TEST_SETTINGS_SERVICE) private readonly testSettingsService: TestSettingsService,
		@inject(TM_TYPES.TEST_SCHEDULER_SERVICE) private readonly testSchedulerService: TestSchedulerService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
		@inject(TM_TYPES.TEST_MIDDLEWARE) private readonly testMiddleware: IMiddleware,
	) {
		super();

		const routes: IRoute[] = [
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
		];

		this.useRoutes(routes);
	}

	async getTestById(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController getTestById] start');

		const dto = await this.testService.getFullByIdAndCheckOwnership(TestInputMapper.toGetFullByIdInput(TestStorage.get()!.id, UserStorage.get()!.id));

		this.logger.info({ message: '[TestController getTestById] got test by id:', data: dto });

		const test: TestFullResponse = TestResponseMapper.toFullResponse(dto);

		this.logger.info({ message: '[TestController getTestById] end:', data: test });

		this.ok(res, test);
	}

	async getUserTest(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController getUserTest] start');

		const dtos = await this.testService.getByAuthor(TestInputMapper.toGetByAuthorInput(UserStorage.get()!.id));

		const tests: TestResponse[] = dtos.map((test: TestResult) => TestResponseMapper.toResponse(test));

		this.logger.info({ message: '[TestController getUserTest] end:', data: tests });

		this.ok(res, tests);
	}

	async createTest(req: Request<object, object, TestCreateRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController createTest] start');

		const dto = await this.testService.create(TestInputMapper.toCreateInput(req.body, UserStorage.get()!.id));

		const createdTest: TestFullResponse = TestResponseMapper.toFullResponse(dto);

		this.logger.info({ message: '[TestController createTest] end:', data: createdTest });

		this.created(res, createdTest);
	}

	async updateTest(req: Request<object, object, TestUpdateRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController updateTest] start');

		const dto = await this.testService.update(TestInputMapper.toUpdateInput(TestStorage.get()!, req.body));

		const updatedTest: TestFullResponse = TestResponseMapper.toFullResponse(dto);

		this.logger.info({ message: '[TestController updateTest] end:', data: updatedTest });

		this.ok(res, updatedTest);
	}

	async deleteTest(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController deleteTest] start');

		await this.testService.delete(TestInputMapper.toDeleteInput(TestStorage.get()!));

		this.logger.info('[TestController deleteTest] end');

		this.noContent(res);
	}

	async updateTestSettings(req: Request<any, object, TestSettingsUpdateRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController updateTestSettings] start');

		const dto = await this.testSettingsService.updateSettings(TestInputMapper.toUpdateSettingsInput(TestStorage.get()!, req.body));

		const updatedTest: TestFullResponse = TestResponseMapper.toFullResponse(dto);

		this.logger.info({ message: '[TestController updateTestSettings] end:', data: updatedTest });

		this.ok(res, updatedTest);
	}

	async updateTestSchedulerPeriods(req: Request<any, object, TestSchedulerPeriodsEditRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[TestController updateTestSchedulerPeriods] start');

		const dto = await this.testSchedulerService.updateSchedulerPeriods(TestInputMapper.toUpdateSchedulerPeriodsInput(TestStorage.get()!, req.body));

		const schedulerResponse: TestSchedulerResponse = SchedulerResponseMapper.toResponse(dto);

		this.logger.info({ message: '[TestController updateTestSchedulerPeriods] end:', data: schedulerResponse });

		this.ok(res, schedulerResponse);
	}
}
