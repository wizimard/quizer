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

@injectable()
export class QuestionService implements IQuestionService {
	constructor(@inject(TM_TYPES.QUESTION_REPOSITORY) private readonly questionRepository: QuestionRepository) {}

	async create(input: CreateQuestionInput): Promise<QuestionResult> {
		const questionEntity = QuestionMapper.buildQuestionFromCreateInput(input);
		const errors = questionEntity.validate();

		if (errors.errors.length) {
			throw new HttpValidationError('validation_failed', 'QuestionService.create', errors);
		}

		const createdQuestion = await this.questionRepository.create(questionEntity);
		return QuestionMapper.toResult(createdQuestion);
	}

	async update(input: UpdateQuestionInput): Promise<QuestionResult> {
		const questionEntity = QuestionMapper.buildQuestionFromUpdateInput(input);
		const errors = questionEntity.validate();

		if (errors.errors.length) {
			throw new HttpValidationError('validation_failed', 'QuestionService.update', errors);
		}

		const updatedQuestion = await this.questionRepository.update(questionEntity);

		return QuestionMapper.toResult(updatedQuestion);
	}

	async delete(input: DeleteQuestionInput): Promise<void> {
		const isDeleted = await this.questionRepository.delete(input.id.value, input.testId.value);

		if (!isDeleted) {
			throw new HttpError(404, 'question_not_found', 'QuestionService.delete');
		}
	}

	async changeOrder(input: ChangeQuestionOrderInput): Promise<QuestionResult[]> {
		const { test, questionId, previousQuestionId, nextQuestionId } = input;

		if (!previousQuestionId && !nextQuestionId) {
			return test.questions.map(QuestionMapper.toResult);
		}

		let newSortKey: number = 0;

		if (previousQuestionId) {
			const previousQuestionIndex = test.questions.findIndex((question) => question.id.value === previousQuestionId);

			if (previousQuestionIndex === -1) {
				throw new HttpError(422, 'previous_question_not_found', 'QuestionService.changeOrder');
			}

			newSortKey = ((test.questions[previousQuestionIndex - 1]?.sortKey ?? (previousQuestionIndex + 1) * 1000) - test.questions[previousQuestionIndex]!.sortKey) / 2;
		} else if (nextQuestionId) {
			const nextQuestionIndex = test.questions.findIndex((question) => question.id.value === nextQuestionId);

			if (nextQuestionIndex === -1) {
				throw new HttpError(422, 'next_question_not_found', 'QuestionService.changeOrder');
			}

			newSortKey = (test.questions[nextQuestionIndex]!.sortKey - (test.questions[nextQuestionIndex + 1]?.sortKey ?? (nextQuestionIndex + 1) * 1000)) / 2;
		}

		newSortKey = Math.round(newSortKey);

		const question: QuestionEntity = test.questions.find((question) => questionId.equals(question.id))!;

		question.sortKey = newSortKey;

		// нормализовать порядок вопросов в бд

		let isNeedChangeOrders = false;

		for (let i = 0; i < test.questions.length - 1; i++) {
			if (test.questions[i + 1]!.sortKey - test.questions[i]!.sortKey < 100) {
				isNeedChangeOrders = true;
				break;
			}
		}

		if (!isNeedChangeOrders) {
			await this.questionRepository.updateQuestionsOrders([question]);
			return test.questions.map(QuestionMapper.toResult);
		}

		for (let i = 0; i < test.questions.length; i++) {
			test.questions[i]!.sortKey = (i + 1) * 1000;
		}

		await this.questionRepository.updateQuestionsOrders(test.questions);

		return test.questions.map(QuestionMapper.toResult);
	}
}
