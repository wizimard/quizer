import { BaseController } from '@shared/http/controller.base';
import type { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { parseIdParam } from '@shared/http/utils/parse-id-param';
import { HttpError } from '@shared/error';
import { QuizNotFoundError } from '@modules/quiz-management/domain/errors/quiz-not-found.error';
import { QuestionNotFoundError } from '../../../domain/errors/question-not-found.error';
import { QE_TYPES } from '../../../quiz-execution.types';
import type { EvaluateAnswerHandler } from '../../../application/handlers/evaluate-answer.handler';
import type { GetQuizForExecutionHandler } from '../../../application/handlers/get-quiz-for-execution.handler';
import type { GetQuestionForExecutionHandler } from '../../../application/handlers/get-question-for-execution.handler';
import { ExecutionResponseMapper } from '../mappers/execution-response.mapper';

@injectable()
export class QuizExecuteController extends BaseController {
	constructor(
		@inject(QE_TYPES.GET_QUIZ_FOR_EXECUTION_HANDLER) private readonly getQuizHandler: GetQuizForExecutionHandler,
		@inject(QE_TYPES.GET_QUESTION_FOR_EXECUTION_HANDLER) private readonly getQuestionHandler: GetQuestionForExecutionHandler,
		@inject(QE_TYPES.EVALUATE_ANSWER_HANDLER) private readonly evaluateAnswerHandler: EvaluateAnswerHandler,
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
		]);
	}

	async getQuiz(req: Request, res: Response, _next: NextFunction): Promise<void> {
		try {
			const quizId = parseIdParam(req, 'quizId', 'quiz id not defined');
			const result = await this.getQuizHandler.execute({ quizId });

			this.ok(res, ExecutionResponseMapper.toQuizHttp(result));
		} catch (error) {
			this.mapError(error);
		}
	}

	async getQuizQuestion(req: Request, res: Response, _next: NextFunction): Promise<void> {
		try {
			const quizId = parseIdParam(req, 'quizId', 'quiz id or question id not defined');
			const questionId = parseIdParam(req, 'questionId', 'quiz id or question id not defined');
			const result = await this.getQuestionHandler.execute({ quizId, questionId });

			this.ok(res, ExecutionResponseMapper.toQuestionHttp(result));
		} catch (error) {
			this.mapError(error);
		}
	}

	async executeQuizQuestion(req: Request, res: Response, _next: NextFunction): Promise<void> {
		try {
			const quizId = parseIdParam(req, 'quizId', 'quiz id or question id not defined');
			const questionId = parseIdParam(req, 'questionId', 'quiz id or question id not defined');
			const result = await this.evaluateAnswerHandler.execute({
				quizId,
				questionId,
				answer: req.body?.answer,
			});

			this.ok(res, ExecutionResponseMapper.toEvaluationHttp(result));
		} catch (error) {
			this.mapError(error);
		}
	}

	private mapError(error: unknown): never {
		if (error instanceof QuestionNotFoundError) {
			throw new HttpError(404, 'question_not_found');
		}

		if (error instanceof QuizNotFoundError) {
			throw new HttpError(404, 'quiz_not_found');
		}

		throw error;
	}
}
