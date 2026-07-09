import { inject, injectable } from 'inversify';
import { TM_TYPES } from '@modules/test-management/test-management.types';
import { TestNotFoundError } from '@modules/test-management/utils/errors/test-not-found.error';
import type { TestRepository } from '@modules/test-management/interfaces/repository/test.repository.interface';
import { TestId } from '@modules/test-management/entities/value-object/test-id';
import { QuestionNotFoundError } from '@modules/test-management/utils/errors/question-not-found.error';
import { evaluateAnswer } from './answer-evaluation/answer-evaluator.registry';
import type { QuestionReadRepository } from '../repositories/question-read.repository.interface';
import { TE_TYPES } from '../test-execution.types';
import type { EvaluateAnswerInput } from '../types/evaluate-answer.input';
import type { GetTestForExecutionInput } from '../types/get-test-for-execution.input';
import type { GetQuestionForExecutionInput } from '../types/get-question-for-execution.input';
import type { EvaluationResultDto } from '../dto/evaluation-result.dto';
import type { ExecutableTestDto } from '../dto/executable-test.dto';
import type { QuestionExecuteDto } from '../dto/question-execute.dto';
import { toExecutableTestDto } from '../mappers/to-executable-test.dto';
import { toQuestionExecuteDto } from '../mappers/to-question-execute.dto';

@injectable()
export class TestExecutionService {
	constructor(
		@inject(TM_TYPES.TEST_REPOSITORY) private readonly testRepository: TestRepository,
		@inject(TE_TYPES.QUESTION_READ_REPOSITORY) private readonly questionRepository: QuestionReadRepository,
	) {}

	async getTest(input: GetTestForExecutionInput): Promise<ExecutableTestDto> {
		const test = await this.testRepository.findFullById(TestId.of(input.testId));

		if (!test) {
			throw new TestNotFoundError('TestExecutionService.getTest');
		}

		return toExecutableTestDto(test);
	}

	async getQuestion(input: GetQuestionForExecutionInput): Promise<QuestionExecuteDto> {
		const question = await this.questionRepository.findById(TestId.of(input.testId), input.questionId);

		if (!question) {
			throw new QuestionNotFoundError('TestExecutionService.getQuestion');
		}

		return toQuestionExecuteDto(question);
	}

	async evaluateAnswer(input: EvaluateAnswerInput): Promise<EvaluationResultDto> {
		const question = await this.questionRepository.findById(TestId.of(input.testId), input.questionId);

		if (!question) {
			throw new QuestionNotFoundError('TestExecutionService.evaluateAnswer');
		}

		const isCorrect = evaluateAnswer(question.config, input.answer);

		return { correct: isCorrect };
	}
}
