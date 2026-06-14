import { BaseController } from '@common/controller.base';
import { inject, injectable } from 'inversify';
import { QUIZ_TYPES } from '../quiz.types';
import type { IQuizService } from '../services/quiz.service.interface';
import type { Request, Response, NextFunction } from 'express';
import { QuizCreateDto } from '../dto/quiz-create.dto';
import { QuizUpdateDto } from '../dto/quiz-update.dto';
import type { IQuizResponse } from '../dto/quiz-response.dto';
import { HttpError } from '../../error/http.error';
import type { IRoute } from '@common/route.interface';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ValidateMiddleware } from '@common/validate.middleware';

@injectable()
export class QuizController extends BaseController {
	constructor(@inject(QUIZ_TYPES.QUIZ_SERVICE) private readonly quizService: IQuizService) {
		super();

		const routes: IRoute[] = [
			{
				url: '/:id',
				method: 'get',
				handler: this.getQuizById,
				middlewares: [new AuthGuard()],
			},
			{
				url: '/',
				method: 'get',
				handler: this.getUserQuiz,
				middlewares: [new AuthGuard()],
			},
			{
				url: '/',
				method: 'post',
				handler: this.createQuiz,
				middlewares: [new AuthGuard(), new ValidateMiddleware(QuizCreateDto)],
			},
			{
				url: '/',
				method: 'patch',
				handler: this.updateQuiz,
				middlewares: [new AuthGuard(), new ValidateMiddleware(QuizUpdateDto)],
			},
			{
				url: '/:id',
				method: 'delete',
				handler: this.deleteQuiz,
				middlewares: [new AuthGuard()],
			},
		];

		this.useRoutes(routes);
	}

	async getQuizById(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.params.id || typeof req.params.id !== 'string') {
			throw new HttpError(400, 'id_wrong_format');
		}

		const quiz: IQuizResponse = await this.quizService.getById(req.params.id, req.user!.id);

		this.ok(res, quiz);
	}
	async getUserQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
		const quizes: IQuizResponse[] = await this.quizService.getByAuthor(req.user!.id);

		this.ok(res, quizes);
	}
	async createQuiz(req: Request<object, object, QuizCreateDto>, res: Response, next: NextFunction): Promise<void> {
		console.log('createQuiz');
		const createdQuiz: IQuizResponse = await this.quizService.create(req.body, req.user!.id);

		this.created(res, createdQuiz);
	}
	async updateQuiz(req: Request<object, object, QuizUpdateDto>, res: Response, next: NextFunction): Promise<void> {
		const updatedQuiz: IQuizResponse = await this.quizService.update(req.body, req.user!.id);

		this.ok(res, updatedQuiz);
	}
	async deleteQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.params.id || typeof req.params.id !== 'string') {
			throw new HttpError(400, 'id_wrong_format');
		}

		await this.quizService.delete(req.params.id, req.user!.id);

		this.noContent(res);
	}
}
