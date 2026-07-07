import { BaseController } from '@shared/http/controller.base';
import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import { QuizCreateDto } from '../dto/http/quiz-create.dto';
import { QuizUpdateDto } from '../dto/http/quiz-update.dto';
import type { IQuizResponse, IQuizResponseBase } from '../interfaces/http/quiz-response.interface';
import type { IRoute } from '@shared/http/route.interface';
import { APP_TYPES } from '@app/app.types';
import type { IMiddlewareFactory } from '@shared/http/middleware.factory.interface';
import { QuizSettingsUpdateDto } from '../dto/http/quiz-settings-update.dto';
import { QuizAvailableEditDto } from '../dto/http/quiz-available-edit.dto';
import { QM_TYPES } from '../quiz-management.types';
import type { QuizService } from '../services/quiz.service';
import { QuizRequestMapper } from '../mappers/http/quiz-request.mapper';
import { QuizResponseMapper } from '../mappers/http/quiz-response.mapper';
import { QE_TYPES } from '@modules/quiz-execution/quiz-execution.types';
import type { QuizSessionService } from '@modules/quiz-execution/services/quiz-session.service';
import { ExecutionResponseMapper } from '@modules/quiz-execution/mappers/execution-response.mapper';
import { QuizStartDto } from '../dto/http/quiz-start.dto';
import type { ParamsDictionary } from 'express-serve-static-core';
import { toQuizDto } from '../mappers/to-quiz.dto';
import { parseIdParam } from '@shared/http/utils/parse-id-param';

@injectable()
export class QuizController extends BaseController {
	constructor(
		@inject(QM_TYPES.QUIZ_SERVICE) private readonly quizService: QuizService,
		@inject(QE_TYPES.QUIZ_SESSION_SERVICE) private readonly quizSessionService: QuizSessionService,
		@inject(APP_TYPES.MIDDLEWARE_FACTORY) private readonly middlewareFactory: IMiddlewareFactory,
	) {
		super();

		const routes: IRoute[] = [
			{
				url: '/:quizId',
				method: 'get',
				handler: this.getQuizById,
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.quizMiddleware(), this.middlewareFactory.quizOwnershipGuard()],
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
				url: '/:quizId',
				method: 'patch',
				handler: this.updateQuiz,
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.quizMiddleware(), this.middlewareFactory.quizOwnershipGuard(), this.middlewareFactory.validate(QuizUpdateDto)],
			},
			{
				url: '/:quizId',
				method: 'delete',
				handler: this.deleteQuiz,
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.quizMiddleware(), this.middlewareFactory.quizOwnershipGuard()],
			},
			{
				url: '/:quizId/settings',
				method: 'patch',
				handler: this.updateQuizSettings,
				middlewares: [
					this.middlewareFactory.authGuard(),
					this.middlewareFactory.quizMiddleware(),
					this.middlewareFactory.quizOwnershipGuard(),
					this.middlewareFactory.validate(QuizSettingsUpdateDto),
				],
			},
			{
				url: '/:quizId/settings/available-periods',
				method: 'patch',
				handler: this.updateQuizAvailablePeriods,
				middlewares: [
					this.middlewareFactory.authGuard(),
					this.middlewareFactory.quizMiddleware(),
					this.middlewareFactory.quizOwnershipGuard(),
					this.middlewareFactory.validate(QuizAvailableEditDto),
				],
			},
			{
				url: '/:quizId/settings/available-periods/:periodId/close',
				method: 'patch',
				handler: this.closeAvailablePeriod,
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.quizMiddleware(), this.middlewareFactory.quizOwnershipGuard()],
			},
			{
				url: '/:quizId/start',
				method: 'post',
				handler: this.startQuiz,
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.quizMiddleware(), this.middlewareFactory.quizOwnershipGuard(), this.middlewareFactory.validate(QuizStartDto)],
			},
			{
				url: '/:quizId/finish',
				method: 'post',
				handler: this.finishQuiz,
				middlewares: [this.middlewareFactory.authGuard(), this.middlewareFactory.quizMiddleware(), this.middlewareFactory.quizOwnershipGuard()],
			},
		];

		this.useRoutes(routes);
	}

	async getQuizById(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const dto = toQuizDto(req.quiz!);
		const quiz: IQuizResponse = QuizResponseMapper.toHttp(dto);

		this.ok(res, quiz);
	}

	async getUserQuiz(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const dtos = await this.quizService.getByAuthor({ authorId: req.user!.id });
		const quizes: IQuizResponseBase[] = QuizResponseMapper.toHttpList(dtos);

		this.ok(res, quizes);
	}

	async createQuiz(req: Request<object, object, QuizCreateDto>, res: Response, _next: NextFunction): Promise<void> {
		const dto = await this.quizService.create(QuizRequestMapper.toCreateInput(req.body, req.user!.id));
		const createdQuiz: IQuizResponse = QuizResponseMapper.toHttp(dto);

		this.created(res, createdQuiz);
	}

	async updateQuiz(req: Request<object, object, QuizUpdateDto>, res: Response, _next: NextFunction): Promise<void> {
		const dto = await this.quizService.update(req.quiz!, QuizRequestMapper.toUpdateInput(req.quiz!, req.body));
		const updatedQuiz: IQuizResponse = QuizResponseMapper.toHttp(dto);

		this.ok(res, updatedQuiz);
	}

	async deleteQuiz(req: Request, res: Response, _next: NextFunction): Promise<void> {
		await this.quizService.delete(req.quiz!);

		this.noContent(res);
	}

	async updateQuizSettings(req: Request<any, object, QuizSettingsUpdateDto>, res: Response, _next: NextFunction): Promise<void> {
		const dto = await this.quizService.updateSettings(req.quiz!, QuizRequestMapper.toUpdateSettingsInput(req.quiz!, req.body));
		const updatedQuiz: IQuizResponse = QuizResponseMapper.toHttp(dto);

		this.ok(res, updatedQuiz);
	}

	async updateQuizAvailablePeriods(req: Request<any, object, QuizAvailableEditDto>, res: Response, _next: NextFunction): Promise<void> {
		const dto = await this.quizService.updateAvailablePeriods(req.quiz!, QuizRequestMapper.toUpdateAvailablePeriodsInput(req.quiz!, req.body));
		const updatedQuiz: IQuizResponse = QuizResponseMapper.toHttp(dto);

		this.ok(res, updatedQuiz);
	}

	async startQuiz(req: Request<ParamsDictionary, any, QuizStartDto>, res: Response, _next: NextFunction): Promise<void> {
		const result = await this.quizSessionService.startQuiz(QuizRequestMapper.toStartCommand(req.quiz!, req.body));

		this.ok(res, ExecutionResponseMapper.toQuizHttp(result));
	}

	async finishQuiz(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const result = await this.quizSessionService.finishQuiz(QuizRequestMapper.toFinishCommand(req.quiz!));

		this.ok(res, ExecutionResponseMapper.toQuizHttp(result));
	}

	async closeAvailablePeriod(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const periodId = parseIdParam(req, 'periodId');

		const result = await this.quizService.closeAvailablePeriod(req.quiz!, QuizRequestMapper.toCloseAvailablePeriodInput(req.quiz!, periodId));

		this.ok(res, QuizResponseMapper.toHttp(result));
	}
}
