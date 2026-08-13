import { QM_TYPES } from '../question-management.types';
import { BaseController } from '@shared/http/controller.base';
import { inject, injectable } from 'inversify';
import type { NextFunction, Request, Response } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import { QuestionCreateRequestDto } from '../dto/http/request/question-create.request-dto';
import { QuestionUpdateRequestDto } from '../dto/http/request/question-update.request-dto';
import { APP_TYPES } from '@app/app.types';
import type { QuestionChangeOrderRequestDto } from '../dto/http/request/question-change-order.request-dto';
import { QuestionInputMapper } from '../mappers/input/question-input.mapper';
import type { QuestionResponse } from '@modules/test-management/dto/http/response/question.response-dto';
import { QuestionResponseMapper } from '../mappers/response/question-response.mapper';
import type { QuestionResult } from '@modules/test-management/interfaces/services/results/question.result';
import type { ILogger } from '@shared/logger';
import type { IMiddleware } from '@shared/http/middleware.interface';
import type { QuestionService } from '../interfaces/services/question.service.interface';
import { AuthGuard } from '@modules/identity-access/middleware/auth.guard';
import { TestOwnershipGuard } from '@modules/test-management/middlewares/test-ownership.guard';
import { ValidateMiddleware } from '@shared/http/validate.middleware';
import { ImageUploadMiddleware } from '@shared/http/image-upload.middleware';
import { TestStorage } from '@modules/test-management/storage/test.storage';
import { TM_TYPES } from '@modules/test-management/test-management.types';
import { parseIdParam } from '@shared/http/utils/parse-id-param';

@injectable()
export class QuestionController extends BaseController {
	private readonly authGuard: AuthGuard = new AuthGuard();
	private readonly testOwnershipGuard: TestOwnershipGuard = new TestOwnershipGuard();
	private readonly imageUploadMiddleware: ImageUploadMiddleware = new ImageUploadMiddleware();

	constructor(
		@inject(QM_TYPES.QUESTION_SERVICE) private readonly questionService: QuestionService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
		@inject(TM_TYPES.TEST_MIDDLEWARE) private readonly testMiddleware: IMiddleware,
	) {
		super();

		this.useRoutes([
			{
				url: '/:testId/questions',
				method: 'post',
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard, this.imageUploadMiddleware, new ValidateMiddleware(QuestionCreateRequestDto)],
				handler: this.createQuestion.bind(this),
			},
			{
				url: '/:testId/questions/:questionId',
				method: 'patch',
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard, this.imageUploadMiddleware, new ValidateMiddleware(QuestionUpdateRequestDto)],
				handler: this.updateQuestion.bind(this),
			},
			{
				url: '/:testId/questions/:questionId',
				method: 'delete',
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard],
				handler: this.deleteQuestion.bind(this),
			},
			{
				url: '/:testId/questions/:questionId/order',
				method: 'patch',
				middlewares: [this.authGuard, this.testMiddleware, this.testOwnershipGuard],
				handler: this.changeQuestionOrder.bind(this),
			},
		]);
	}

	async createQuestion(req: Request<ParamsDictionary, unknown, QuestionCreateRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[QuestionController createQuestion] start');

		const result: QuestionResult = await this.questionService.create(QuestionInputMapper.toCreateInput(req.body, TestStorage.get()!, req.file));

		const createdQuestion: QuestionResponse = QuestionResponseMapper.toResponse(result);

		this.logger.info({ message: '[QuestionController createQuestion] end:', data: createdQuestion });

		this.created(res, createdQuestion);
	}

	async updateQuestion(req: Request<ParamsDictionary, unknown, QuestionUpdateRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[QuestionController updateQuestion] start');

		const questionId = parseIdParam(req, 'questionId');

		const result: QuestionResult = await this.questionService.update(QuestionInputMapper.toUpdateInput(req.body, questionId, TestStorage.get()!.id, req.file));

		const updatedQuestion: QuestionResponse = QuestionResponseMapper.toResponse(result);

		this.logger.info({ message: '[QuestionController updateQuestion] end:', data: updatedQuestion });

		this.ok(res, updatedQuestion);
	}

	async deleteQuestion(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[QuestionController deleteQuestion] start');

		const questionId = parseIdParam(req, 'questionId');
		await this.questionService.delete(QuestionInputMapper.toDeleteInput(questionId, TestStorage.get()!.id));

		this.logger.info('[QuestionController deleteQuestion] end');

		this.noContent(res);
	}

	async changeQuestionOrder(req: Request<ParamsDictionary, unknown, QuestionChangeOrderRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[QuestionController changeQuestionOrder] start');

		const questionId = parseIdParam(req, 'questionId');
		const result: QuestionResult[] = await this.questionService.changeOrder(QuestionInputMapper.toChangeOrderInput(req.body, questionId, TestStorage.get()!.id));

		const response: QuestionResponse[] = result.map(QuestionResponseMapper.toResponse);

		this.logger.info({ message: '[QuestionController changeQuestionOrder] end:', data: response });

		this.ok(res, response);
	}
}
