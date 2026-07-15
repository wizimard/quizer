import { HttpValidationError } from '@shared/error/http-validation.error';
import { inject, injectable } from 'inversify';
import type { QuestionRepository } from '../interfaces/repository/question.repository.interface';
import { TM_TYPES } from '../test-management.types';
import { HttpError } from '@shared/error';
import type { QuestionEntity } from '../entities/question.entity';
import type { CreateQuestionInput } from '../interfaces/services/input/create-question.input';
import type { DeleteQuestionInput } from '../interfaces/services/input/delete-question.input';
import type { ChangeQuestionOrderInput } from '../interfaces/services/input/update-question-order.input';
import type { UpdateQuestionInput } from '../interfaces/services/input/update-question.input';
import type { IQuestionService } from '../interfaces/services/question.service.interface';
import { QuestionMapper } from '../mappers/question.mapper';
import type { QuestionResult } from '../interfaces/services/results/question.result';
import { QuestionNotFoundError } from '../utils/errors/question-not-found.error';
import type { ILogger } from '@shared/logger';
import { APP_TYPES } from '@app/app.types';
import type { TestRepository } from '../interfaces/repository/test.repository.interface';
import type { TestEntity } from '../entities/test.entity';

@injectable()
export class QuestionService implements IQuestionService {
	constructor(
		@inject(TM_TYPES.QUESTION_REPOSITORY) private readonly questionRepository: QuestionRepository,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
		@inject(TM_TYPES.TEST_REPOSITORY) private readonly testRepository: TestRepository,
	) {}

	async create(input: CreateQuestionInput): Promise<QuestionResult> {
		this.logger.info({ message: '[QuestionService create] start', data: input });

		const questions = await this.questionRepository.findByTestId(input.testId.value);

		const questionEntity = QuestionMapper.buildQuestionFromCreateInput(input, (questions.length + 1) * 1000);

		const errors = questionEntity.validate();

		if (errors.errors.length) {
			throw new HttpValidationError('validation_failed', 'QuestionService.create', errors);
		}

		const createdQuestion = await this.questionRepository.create(questionEntity);

		this.logger.info({ message: '[QuestionService create] question created', data: createdQuestion });

		return QuestionMapper.toResult(createdQuestion);
	}

	async update(input: UpdateQuestionInput): Promise<QuestionResult> {
		this.logger.info({ message: '[QuestionService update] start', data: input });

		const questionEntity = QuestionMapper.buildQuestionFromUpdateInput(input);
		const errors = questionEntity.validate();

		if (errors.errors.length) {
			throw new HttpValidationError('validation_failed', 'QuestionService.update', errors);
		}

		const updatedQuestion = await this.questionRepository.update(questionEntity);

		this.logger.info({ message: '[QuestionService update] question updated', data: updatedQuestion });

		return QuestionMapper.toResult(updatedQuestion);
	}

	async delete(input: DeleteQuestionInput): Promise<void> {
		this.logger.info({ message: '[QuestionService delete] start', data: input });

		const isDeleted = await this.questionRepository.delete(input.id.value, input.testId.value);

		if (!isDeleted) {
			throw new QuestionNotFoundError('QuestionService.delete');
		}

		this.logger.info('[QuestionService delete] question deleted');

		this.logger.info({ message: 'QuestionService.delete question deleted' });
	}

	async changeOrder(input: ChangeQuestionOrderInput): Promise<QuestionResult[]> {
		this.logger.info({ message: '[QuestionService changeOrder] start', data: input });

		const { testId, questionId, previousQuestionId, nextQuestionId } = input;

		const test: TestEntity = (await this.testRepository.findFullById(testId.value))!;

		if (!previousQuestionId && !nextQuestionId) {
			return test.questions.map(QuestionMapper.toResult);
		}

		let newSortKey: number = 0;

		if (previousQuestionId) {
			const previousQuestionIndex = test.questions.findIndex((question) => question.id.value === previousQuestionId);

			if (previousQuestionIndex === -1) {
				throw new HttpError(422, 'previous_question_not_found', 'QuestionService.changeOrder');
			}

			const prevSortKey = test.questions[previousQuestionIndex]!.sortKey;
			const nextSortKey = test.questions[previousQuestionIndex + 1]?.sortKey ?? (previousQuestionIndex + 1) * 1000;

			newSortKey = nextSortKey - (nextSortKey - prevSortKey) / 2;
		} else if (nextQuestionId) {
			const nextQuestionIndex = test.questions.findIndex((question) => question.id.value === nextQuestionId);

			if (nextQuestionIndex === -1) {
				throw new HttpError(422, 'next_question_not_found', 'QuestionService.changeOrder');
			}

			const prevSortKey = test.questions[nextQuestionIndex - 1]?.sortKey ?? 0;
			const nextSortKey = test.questions[nextQuestionIndex]!.sortKey;

			newSortKey = nextSortKey - (nextSortKey - prevSortKey) / 2;
		}

		if (!newSortKey) {
			throw new Error('newSortKey is not defined');
		}

		newSortKey = Math.round(newSortKey);

		const question: QuestionEntity = test.questions.find((question) => questionId.equals(question.id))!;

		question.sortKey = newSortKey;

		test.questions.sort((a: QuestionEntity, b: QuestionEntity) => a.sortKey - b.sortKey);

		// нормализовать порядок вопросов в бд

		let isNeedChangeOrders = false;

		for (let i = 0; i < test.questions.length - 1; i++) {
			if (Math.abs(test.questions[i + 1]!.sortKey - test.questions[i]!.sortKey) < 50) {
				isNeedChangeOrders = true;
				break;
			}
		}

		if (!isNeedChangeOrders) {
			this.logger.info('[QuestionService changeOrder] question order changed');

			await this.questionRepository.updateQuestionsOrders([question]);

			return test.questions.map(QuestionMapper.toResult);
		}

		for (let i = 0; i < test.questions.length; i++) {
			test.questions[i]!.sortKey = (i + 1) * 1000;
		}

		await this.questionRepository.updateQuestionsOrders(test.questions);

		this.logger.info('[QuestionService changeOrder] all questions orders changed in database');

		return test.questions.map(QuestionMapper.toResult);
	}
}
