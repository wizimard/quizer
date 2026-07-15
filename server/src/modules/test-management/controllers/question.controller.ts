import { TM_TYPES } from '../test-management.types';
import { BaseController } from '@shared/http/controller.base';
import { inject, injectable } from 'inversify';
import type { QuestionService } from '../services/question.service';
import type { NextFunction, Request, Response } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import { QuestionCreateRequestDto } from '../dto/http/request/question-create.request-dto';
import { QuestionUpdateRequestDto } from '../dto/http/request/question-update.request-dto';
import { APP_TYPES } from '@app/app.types';
import type { IMiddlewareFactory } from '@shared/http/middleware.factory.interface';
import type { QuestionChangeOrderRequestDto } from '../dto/http/request/question-change-order.request-dto';
import { QuestionInputMapper } from '../mappers/input/question-input.mapper';
import type { QuestionResponse } from '../dto/http/response/question.response-dto';
import { QuestionMapper } from '../mappers/question.mapper';
import type { QuestionResult } from '../interfaces/services/results/question.result';
import type { ILogger } from '@shared/logger';
import type { IMiddleware } from '@shared/http/middleware.interface';

@injectable()
export class QuestionController extends BaseController {
	constructor(
		@inject(TM_TYPES.QUESTION_SERVICE) private readonly questionService: QuestionService,
		@inject(APP_TYPES.MIDDLEWARE_FACTORY) private readonly middlewareFactory: IMiddlewareFactory,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
		@inject(TM_TYPES.QUESTION_EXISTS_GUARD) private readonly questionExistsGuard: IMiddleware,
	) {
		super();

		this.useRoutes([
			{
				url: '/:testId/questions',
				method: 'post',
				middlewares: [
					this.middlewareFactory.authGuard(),
					this.middlewareFactory.testMiddleware(),
					this.middlewareFactory.testOwnershipGuard(),
					this.middlewareFactory.validate(QuestionCreateRequestDto),
				],
				handler: this.createQuestion.bind(this),
			},
			{
				url: '/:testId/questions/:questionId',
				method: 'patch',
				middlewares: [
					this.middlewareFactory.authGuard(),
					this.middlewareFactory.testMiddleware(),
					this.middlewareFactory.testOwnershipGuard(),
					this.questionExistsGuard,
					this.middlewareFactory.validate(QuestionUpdateRequestDto),
				],
				handler: this.updateQuestion.bind(this),
			},
			{
				url: '/:testId/questions/:questionId',
				method: 'delete',
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.testMiddleware(), this.middlewareFactory.testOwnershipGuard(), this.questionExistsGuard],
				handler: this.deleteQuestion.bind(this),
			},
			{
				url: '/:testId/questions/:questionId/order',
				method: 'patch',
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.testMiddleware(), this.middlewareFactory.testOwnershipGuard(), this.questionExistsGuard],
				handler: this.changeQuestionOrder.bind(this),
			},
		]);
	}

	async createQuestion(req: Request<ParamsDictionary, unknown, QuestionCreateRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[QuestionController createQuestion] start');

		const result: QuestionResult = await this.questionService.create(QuestionInputMapper.toCreateInput(req.body, req.test!));

		const createdQuestion: QuestionResponse = QuestionMapper.toResponse(result);

		this.logger.info({ message: '[QuestionController createQuestion] end:', data: createdQuestion });

		this.created(res, createdQuestion);
	}

	async updateQuestion(req: Request<ParamsDictionary, unknown, QuestionUpdateRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[QuestionController updateQuestion] start');

		const result: QuestionResult = await this.questionService.update(QuestionInputMapper.toUpdateInput(req.body, req.question!));

		const updatedQuestion: QuestionResponse = QuestionMapper.toResponse(result);

		this.logger.info({ message: '[QuestionController updateQuestion] end:', data: updatedQuestion });

		this.ok(res, updatedQuestion);
	}

	async deleteQuestion(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[QuestionController deleteQuestion] start');

		await this.questionService.delete(QuestionInputMapper.toDeleteInput(req.question!));

		this.logger.info('[QuestionController deleteQuestion] end');

		this.noContent(res);
	}

	async changeQuestionOrder(req: Request<ParamsDictionary, unknown, QuestionChangeOrderRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		this.logger.info('[QuestionController changeQuestionOrder] start');

		const result: QuestionResult[] = await this.questionService.changeOrder(QuestionInputMapper.toChangeOrderInput(req.body, req.question!));

		const response: QuestionResponse[] = result.map(QuestionMapper.toResponse);

		this.logger.info({ message: '[QuestionController changeQuestionOrder] end:', data: response });

		this.ok(res, response);
	}
}
