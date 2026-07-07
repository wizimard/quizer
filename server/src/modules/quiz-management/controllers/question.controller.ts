import { QM_TYPES } from '../quiz-management.types';
import { BaseController } from '@shared/http/controller.base';
import { inject, injectable } from 'inversify';
import type { QuestionService } from '../services/question.service';
import type { NextFunction, Request, Response } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import { QuestionCreateDto } from '../dto/http/question-create.dto';
import type { IQuestionResponse } from '../interfaces/http/question-response.interface';
import { QuestionRequestMapper } from '../mappers/http/question-request.mapper';
import { QuestionResponseMapper } from '../mappers/http/question-response.mapper';
import { QuestionUpdateDto } from '../dto/http/question-update.dto';
import { parseIdParam } from '@shared/http/utils/parse-id-param';
import { APP_TYPES } from '@app/app.types';
import type { IMiddlewareFactory } from '@shared/http/middleware.factory.interface';
import { QuestionExistsGuard } from '../middlewares/question-exists.guard';
import { QuizResponseMapper } from '../mappers/http/quiz-response.mapper';
import type { QuestionChangeOrderDto } from '../dto/http/question-change-order.dto';

@injectable()
export class QuestionController extends BaseController {
	private readonly questionExistsGuard: QuestionExistsGuard = new QuestionExistsGuard();
	constructor(
		@inject(QM_TYPES.QUESTION_SERVICE) private readonly questionService: QuestionService,
		@inject(APP_TYPES.MIDDLEWARE_FACTORY) private readonly middlewareFactory: IMiddlewareFactory,
	) {
		super();

		this.useRoutes([
			{
				url: '/:quizId/questions',
				method: 'post',
				middlewares: [
					this.middlewareFactory.authGuard(),
					this.middlewareFactory.quizMiddleware(),
					this.middlewareFactory.quizOwnershipGuard(),
					this.middlewareFactory.validate(QuestionCreateDto),
				],
				handler: this.createQuestion.bind(this),
			},
			{
				url: '/:quizId/questions/:questionId',
				method: 'patch',
				middlewares: [
					this.middlewareFactory.authGuard(),
					this.middlewareFactory.quizMiddleware(),
					this.middlewareFactory.quizOwnershipGuard(),
					this.questionExistsGuard,
					this.middlewareFactory.validate(QuestionUpdateDto),
				],
				handler: this.updateQuestion.bind(this),
			},
			{
				url: '/:quizId/questions/:questionId',
				method: 'delete',
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.quizMiddleware(), this.middlewareFactory.quizOwnershipGuard(), this.questionExistsGuard],
				handler: this.deleteQuestion.bind(this),
			},
			{
				url: '/:quizId/questions/:questionId/order',
				method: 'patch',
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.quizMiddleware(), this.middlewareFactory.quizOwnershipGuard(), this.questionExistsGuard],
				handler: this.changeQuestionOrder.bind(this),
			},
		]);
	}

	async createQuestion(req: Request<ParamsDictionary, unknown, QuestionCreateDto>, res: Response, _next: NextFunction): Promise<void> {
		const dto = await this.questionService.create(QuestionRequestMapper.toCreateInput(req.body, req.quiz!));

		const createdQuestion: IQuestionResponse = QuestionResponseMapper.toHttp(dto);

		this.created(res, createdQuestion);
	}

	async updateQuestion(req: Request<ParamsDictionary, unknown, QuestionUpdateDto>, res: Response, _next: NextFunction): Promise<void> {
		const questionId = parseIdParam(req, 'questionId');

		const dto = await this.questionService.update(QuestionRequestMapper.toUpdateInput(req.body, req.quiz!.id.value, questionId));

		const updatedQuestion: IQuestionResponse = QuestionResponseMapper.toHttp(dto);

		this.ok(res, updatedQuestion);
	}

	async deleteQuestion(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req, 'quizId');
		const questionId = parseIdParam(req, 'questionId');

		await this.questionService.delete(QuestionRequestMapper.toDeleteInput(questionId, quizId));

		this.noContent(res);
	}

	async changeQuestionOrder(req: Request<ParamsDictionary, unknown, QuestionChangeOrderDto>, res: Response, _next: NextFunction): Promise<void> {
		const questionId = parseIdParam(req, 'questionId');

		const dto = await this.questionService.changeOrder(QuestionRequestMapper.toChangeOrderInput(req.body, req.quiz!, questionId));

		this.ok(res, QuizResponseMapper.toHttp(dto));
	}
}
