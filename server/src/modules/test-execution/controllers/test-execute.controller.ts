import { BaseController } from '@shared/http/controller.base';
import type { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { parseIdParam } from '@shared/http/utils/parse-id-param';
import { TM_TYPES, TestStorage } from '@modules/test-management';
import { TE_TYPES } from '../test-execution.types';
import { TestExecuteMapper } from '../mappers/test-execute.mapper';
import { TestRegisterRequestDto } from '../dto/request/test-register-request.dto';
import type { IMiddleware } from '@shared/http/middleware.interface';
import { TestExecutionUserMapper } from '../mappers/test-execution-user.mapper';
import { TestOpenGuard } from '../middlewares/test-open.guard';
import { QuestionAnswerRequestDto } from '../dto/request/question-answer-request.dto';
import { ValidateMiddleware } from '@shared/http/validate.middleware';
import type { TestExecuteService } from '../interfaces/services/test-execute.service.interface';
import type { TestRegisterService } from '../interfaces/services/test-register.service.interface';
import type { TestAnswerService } from '../interfaces/services/test-answer.service.interface';

@injectable()
export class TestExecuteController extends BaseController {
	private readonly testOpenGuard = new TestOpenGuard();

	constructor(
		@inject(TE_TYPES.TEST_EXECUTION_SERVICE) private readonly testExecutionService: TestExecuteService,
		@inject(TE_TYPES.TEST_REGISTER_SERVICE) private readonly testRegisterService: TestRegisterService,
		@inject(TE_TYPES.TEST_ANSWER_SERVICE) private readonly testAnswerService: TestAnswerService,
		@inject(TM_TYPES.TEST_MIDDLEWARE) private readonly testMiddleware: IMiddleware,
	) {
		super();

		this.useRoutes([
			{
				url: '/:testId',
				method: 'get',
				handler: this.getTest,
			},
			{
				url: '/:testId/register',
				method: 'post',
				handler: this.registerUserForTest,
				middlewares: [new ValidateMiddleware(TestRegisterRequestDto), this.testMiddleware, this.testOpenGuard],
			},
			{
				url: '/:testId/:questionId/answer',
				method: 'post',
				handler: this.answerQuestion,
				middlewares: [new ValidateMiddleware(QuestionAnswerRequestDto), this.testMiddleware, this.testOpenGuard],
			},
		]);
	}

	async getTest(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const testId = parseIdParam(req, 'testId');

		const result = await this.testExecutionService.getTest({ testId });

		this.ok(res, TestExecuteMapper.toResponse(result));
	}

	async registerUserForTest(req: Request<unknown, unknown, TestRegisterRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		const result = await this.testRegisterService.registerUserForTest(TestExecutionUserMapper.toTestRegisterUserInput(TestStorage.get()!, req.body));

		this.ok(res, TestExecutionUserMapper.toResponse(result));
	}

	async answerQuestion(req: Request<any, unknown, QuestionAnswerRequestDto>, res: Response, _next: NextFunction): Promise<void> {
		const questionId = parseIdParam(req, 'questionId');

		const result = await this.testAnswerService.answerQuestion(TestExecutionUserMapper.toAnswerQuestionInput(TestStorage.get()!.id, questionId, req.body));

		this.ok(res, TestExecutionUserMapper.toResponse(result));
	}
}
