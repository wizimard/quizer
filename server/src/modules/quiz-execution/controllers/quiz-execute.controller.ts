import { BaseController } from '@shared/http/controller.base';
import type { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { parseIdParam } from '@shared/http/utils/parse-id-param';
import { QE_TYPES } from '../quiz-execution.types';
import type { QuizExecutionService } from '../services/quiz-execution.service';
import { ExecutionResponseMapper } from '../mappers/execution-response.mapper';

@injectable()
export class QuizExecuteController extends BaseController {
	constructor(@inject(QE_TYPES.QUIZ_EXECUTION_SERVICE) private readonly quizExecutionService: QuizExecutionService) {
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
		const quizId = parseIdParam(req, 'quizId', 'quiz id not defined');
		const result = await this.quizExecutionService.getQuiz({ quizId });

		this.ok(res, ExecutionResponseMapper.toQuizHttp(result));
	}

	async getQuizQuestion(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req, 'quizId', 'quiz id or question id not defined');
		const questionId = parseIdParam(req, 'questionId', 'quiz id or question id not defined');
		const result = await this.quizExecutionService.getQuestion({ quizId, questionId });

		this.ok(res, ExecutionResponseMapper.toQuestionHttp(result));
	}

	async executeQuizQuestion(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const quizId = parseIdParam(req, 'quizId', 'quiz id or question id not defined');
		const questionId = parseIdParam(req, 'questionId', 'quiz id or question id not defined');
		const result = await this.quizExecutionService.evaluateAnswer({
			quizId,
			questionId,
			answer: req.body?.answer,
		});

		this.ok(res, ExecutionResponseMapper.toEvaluationHttp(result));
	}
}
