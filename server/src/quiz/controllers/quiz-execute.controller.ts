import { BaseController } from '@common/controller.base';
import type { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { HttpError } from '@error';
import { QUIZ_TYPES } from '../quiz.types';
import type { IQuizService } from '../services/quiz.service.interface';
import type { IQuestionService } from '../services/question.service.interface';

@injectable()
export class QuizExecuteController extends BaseController {
	constructor(
		@inject(QUIZ_TYPES.QUIZ_SERVICE) private readonly quizService: IQuizService,
		@inject(QUIZ_TYPES.QUESTION_SERVICE) private readonly questionService: IQuestionService,
	) {
		super();

		this.useRoutes([
			{
				url: '/quiz-execute/:quizId',
				method: 'get',
				handler: this.getQuiz,
			},
			{
				url: '/quiz-execute/:quizId/start',
				method: 'post',
				handler: this.startQuiz,
			},
			{
				url: '/quiz-execute/:quizId/:questionId',
				method: 'get',
				handler: this.getQuizQuestion,
			},
			{
				url: '/quiz-execute/:quizId/:questionId',
				method: 'post',
				handler: this.executeQuizQuestion,
			},
		]);
	}

	async getQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
		const quizId: string = req.params.quizId as string;

		if (!quizId) {
			throw new HttpError(400, 'quiz id not defined');
		}

		const quiz = await this.quizService.getByIdForExecute(quizId);

		this.ok(res, quiz);
	}

	async startQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {}

	async getQuizQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
		const quizId: string | undefined = req.params.quizId as string;
		const questionId: string | undefined = req.params.questionId as string;

		if (!quizId || !questionId) {
			throw new HttpError(400, 'quiz id or question id not defined');
		}

		const question = await this.questionService.getQuestion(quizId, questionId);

		this.ok(res, question);
	}

	async executeQuizQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {}
}
