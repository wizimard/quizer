import { BaseController } from '@common/controller.base';
import type { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { parseIdParam } from '@common/utils/parse-id-param';
import { QUIZ_TYPES } from '@composition/quiz.types';
import type { IQuizService } from '@application/quiz/quiz.service.interface';
import type { IQuestionService } from '@application/quiz/question.service.interface';
import type { IAnswerEvaluationService } from '@application/quiz/execution/answer-evaluation.service.interface';
import type { IQuizExecuteResponse } from './types/quiz-execute-response.interface';
import type { IAnswerEvaluationResponse } from './types/answer-evaluation-response.interface';

@injectable()
export class QuizExecuteController extends BaseController {
	constructor(
		@inject(QUIZ_TYPES.QUIZ_SERVICE) private readonly quizService: IQuizService,
		@inject(QUIZ_TYPES.QUESTION_SERVICE) private readonly questionService: IQuestionService,
		@inject(QUIZ_TYPES.ANSWER_EVALUATION_SERVICE) private readonly answerEvaluationService: IAnswerEvaluationService,
	) {
		super();

		this.useRoutes([
			{
				url: '/quiz-execute/:quizId',
				method: 'get',
				handler: this.getQuiz,
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
			{
				url: '/quiz-execute/:quizId/start',
				method: 'post',
				handler: this.startQuiz,
			},
			{
				url: '/quiz-execute/:quizId/finish',
				method: 'post',
				handler: this.finishQuiz,
			},
		]);
	}

	async getQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req, 'quizId', 'quiz id not defined');

		const quiz: IQuizExecuteResponse = await this.quizService.getByIdForExecute(quizId);

		this.ok(res, quiz);
	}

	async startQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req, 'quizId', 'quiz id not defined');
		const quiz: IQuizExecuteResponse = await this.quizService.startQuiz(quizId);
		this.ok(res, quiz);
	}

	async finishQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req, 'quizId', 'quiz id not defined');
		const quiz: IQuizExecuteResponse = await this.quizService.finishQuiz(quizId);
		this.ok(res, quiz);
	}

	async getQuizQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req, 'quizId', 'quiz id or question id not defined');
		const questionId = parseIdParam(req, 'questionId', 'quiz id or question id not defined');

		const question = await this.questionService.getQuestion(quizId, questionId);

		this.ok(res, question);
	}

	async executeQuizQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req, 'quizId', 'quiz id or question id not defined');
		const questionId = parseIdParam(req, 'questionId', 'quiz id or question id not defined');

		const result: IAnswerEvaluationResponse = await this.answerEvaluationService.evaluateAnswer(quizId, questionId, req.body?.answer);

		this.ok(res, result);
	}
}
