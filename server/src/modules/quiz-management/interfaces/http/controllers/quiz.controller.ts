import { BaseController } from '@shared/http/controller.base';
import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import { QuizCreateDto } from '../dto/quiz-create.dto';
import { QuizUpdateDto } from '../dto/quiz-update.dto';
import type { IQuizResponse } from '../types/quiz-response.interface';
import type { IRoute } from '@shared/http/route.interface';
import { APP_TYPES } from '@app/app.types';
import type { IMiddlewareFactory } from '@shared/http/middleware.factory.interface';
import { QuizSettingsUpdateDto } from '../dto/quiz-settings-update.dto';
import { parseIdParam } from '@shared/http/utils/parse-id-param';
import { QM_TYPES } from '../../../quiz-management.types';
import type { CreateQuizHandler } from '../../../application/handlers/create-quiz.handler';
import type { UpdateQuizHandler } from '../../../application/handlers/update-quiz.handler';
import type { UpdateQuizSettingsHandler } from '../../../application/handlers/update-quiz-settings.handler';
import type { DeleteQuizHandler } from '../../../application/handlers/delete-quiz.handler';
import type { GetQuizByIdHandler } from '../../../application/handlers/get-quiz-by-id.handler';
import type { GetQuizzesByAuthorHandler } from '../../../application/handlers/get-quizzes-by-author.handler';
import { QuizRequestMapper } from '../mappers/quiz-request.mapper';
import { QuizResponseMapper } from '../mappers/quiz-response.mapper';
import { QE_TYPES } from '@modules/quiz-execution/quiz-execution.types';
import type { StartQuizHandler } from '@modules/quiz-execution/application/handlers/start-quiz.handler';
import type { FinishQuizHandler } from '@modules/quiz-execution/application/handlers/finish-quiz.handler';
import { ExecutionResponseMapper } from '@modules/quiz-execution/interfaces/http/mappers/execution-response.mapper';

@injectable()
export class QuizController extends BaseController {
	constructor(
		@inject(QM_TYPES.CREATE_QUIZ_HANDLER) private readonly createQuizHandler: CreateQuizHandler,
		@inject(QM_TYPES.UPDATE_QUIZ_HANDLER) private readonly updateQuizHandler: UpdateQuizHandler,
		@inject(QM_TYPES.UPDATE_QUIZ_SETTINGS_HANDLER) private readonly updateQuizSettingsHandler: UpdateQuizSettingsHandler,
		@inject(QM_TYPES.DELETE_QUIZ_HANDLER) private readonly deleteQuizHandler: DeleteQuizHandler,
		@inject(QM_TYPES.GET_QUIZ_BY_ID_HANDLER) private readonly getQuizByIdHandler: GetQuizByIdHandler,
		@inject(QM_TYPES.GET_QUIZZES_BY_AUTHOR_HANDLER) private readonly getQuizzesByAuthorHandler: GetQuizzesByAuthorHandler,
		@inject(QE_TYPES.START_QUIZ_HANDLER) private readonly startQuizHandler: StartQuizHandler,
		@inject(QE_TYPES.FINISH_QUIZ_HANDLER) private readonly finishQuizHandler: FinishQuizHandler,
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
			{
				url: '/:id/start',
				method: 'post',
				handler: this.startQuiz,
				middlewares: [this.middlewareFactory.authGuard()],
			},
			{
				url: '/:id/finish',
				method: 'post',
				handler: this.finishQuiz,
				middlewares: [this.middlewareFactory.authGuard()],
			},
		];

		this.useRoutes(routes);
	}

	async getQuizById(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req);
		const dto = await this.getQuizByIdHandler.execute({ quizId, userId: req.user!.id });
		const quiz: IQuizResponse = QuizResponseMapper.toHttp(dto);

		this.ok(res, quiz);
	}

	async getUserQuiz(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const dtos = await this.getQuizzesByAuthorHandler.execute({ authorId: req.user!.id });
		const quizes: IQuizResponse[] = QuizResponseMapper.toHttpList(dtos);

		this.ok(res, quizes);
	}

	async createQuiz(req: Request<object, object, QuizCreateDto>, res: Response, _next: NextFunction): Promise<void> {
		const dto = await this.createQuizHandler.execute(QuizRequestMapper.toCreateCommand(req.body, req.user!.id));
		const createdQuiz: IQuizResponse = QuizResponseMapper.toHttp(dto);

		this.created(res, createdQuiz);
	}

	async updateQuiz(req: Request<object, object, QuizUpdateDto>, res: Response, _next: NextFunction): Promise<void> {
		const dto = await this.updateQuizHandler.execute(QuizRequestMapper.toUpdateCommand(req.body, req.user!.id));
		const updatedQuiz: IQuizResponse = QuizResponseMapper.toHttp(dto);

		this.ok(res, updatedQuiz);
	}

	async deleteQuiz(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req);

		await this.deleteQuizHandler.execute({ quizId, authorId: req.user!.id });

		this.noContent(res);
	}

	async updateQuizSettings(req: Request<any, object, QuizSettingsUpdateDto>, res: Response, _next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req);
		const dto = await this.updateQuizSettingsHandler.execute(QuizRequestMapper.toUpdateSettingsCommand(quizId, req.body, req.user!.id));
		const updatedQuiz: IQuizResponse = QuizResponseMapper.toHttp(dto);

		this.ok(res, updatedQuiz);
	}

	async startQuiz(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req);
		const result = await this.startQuizHandler.execute({ quizId });

		this.ok(res, ExecutionResponseMapper.toQuizHttp(result));
	}

	async finishQuiz(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req);
		const result = await this.finishQuizHandler.execute({ quizId });

		this.ok(res, ExecutionResponseMapper.toQuizHttp(result));
	}
}
