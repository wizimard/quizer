import { BaseController } from '@common/controller.base';
import { inject, injectable } from 'inversify';
import { QUIZ_TYPES } from '@composition/quiz.types';
import type { IQuizService } from '@application/quiz/quiz.service.interface';
import type { Request, Response, NextFunction } from 'express';
import { QuizCreateDto } from './dto/quiz-create.dto';
import { QuizUpdateDto } from './dto/quiz-update.dto';
import type { IQuizResponse } from './types/quiz-response.interface';
import type { IRoute } from '@common/route.interface';
import { APP_TYPES } from '@app_types';
import type { IMiddlewareFactory } from '@common/middleware.factory.interface';
import { QuizSettingsUpdateDto } from './dto/quiz-settings-update.dto';
import { parseIdParam } from '@common/utils/parse-id-param';

@injectable()
export class QuizController extends BaseController {
	constructor(
		@inject(QUIZ_TYPES.QUIZ_SERVICE) private readonly quizService: IQuizService,
		@inject(APP_TYPES.MIDDLEWARE_FACTORY) private readonly middlewareFactory: IMiddlewareFactory,
	) {
		super();

		const routes: IRoute[] = [
			{
				url: '/:id',
				method: 'get',
				handler: this.getQuizById,
				middlewares: [this.middlewareFactory.authGuard()],
			},
			{
				url: '/',
				method: 'get',
				handler: this.getUserQuiz,
				middlewares: [this.middlewareFactory.authGuard()],
			},
			{
				url: '/',
				method: 'post',
				handler: this.createQuiz,
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.validate(QuizCreateDto)],
			},
			{
				url: '/',
				method: 'patch',
				handler: this.updateQuiz,
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.validate(QuizUpdateDto)],
			},
			{
				url: '/:id',
				method: 'delete',
				handler: this.deleteQuiz,
				middlewares: [this.middlewareFactory.authGuard()],
			},
			{
				url: '/:id/settings',
				method: 'patch',
				handler: this.updateQuizSettings,
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.validate(QuizSettingsUpdateDto)],
			},
		];

		this.useRoutes(routes);
	}

	async getQuizById(req: Request, res: Response, next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req);

		const quiz: IQuizResponse = await this.quizService.getById(quizId, req.user!.id);

		this.ok(res, quiz);
	}
	async getUserQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
		const quizes: IQuizResponse[] = await this.quizService.getByAuthor(req.user!.id);

		this.ok(res, quizes);
	}
	async createQuiz(req: Request<object, object, QuizCreateDto>, res: Response, next: NextFunction): Promise<void> {
		const createdQuiz: IQuizResponse = await this.quizService.create(req.body, req.user!.id);

		this.created(res, createdQuiz);
	}
	async updateQuiz(req: Request<object, object, QuizUpdateDto>, res: Response, next: NextFunction): Promise<void> {
		const updatedQuiz: IQuizResponse = await this.quizService.update(req.body, req.user!.id);

		this.ok(res, updatedQuiz);
	}
	async deleteQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req);

		await this.quizService.delete(quizId, req.user!.id);

		this.noContent(res);
	}

	async updateQuizSettings(req: Request<any, object, QuizSettingsUpdateDto>, res: Response, next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req);

		const updatedQuiz: IQuizResponse = await this.quizService.updateSettings(quizId, req.body, req.user!.id);

		this.ok(res, updatedQuiz);
	}
}
