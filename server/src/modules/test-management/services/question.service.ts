import { HttpValidationError } from '@shared/error/http-validation.error';
import { inject, injectable } from 'inversify';
import type { QuestionDto, TestDto } from '../dto/entities/test.entity.dto';
import type { QuestionRepository } from '../interfaces/repository/question.repository.interface';
import { buildQuestionFromCreateInput, buildQuestionFromUpdateInput, toQuestionDto } from '../mappers/question-entity.mapper';
import { QuestionId } from '../entities/value-object/question-id';
import { TestId } from '../entities/value-object/test-id';
import { TM_TYPES } from '../test-management.types';
import type { ChangeQuestionOrderInput, CreateQuestionInput, DeleteQuestionInput, UpdateQuestionInput } from '../interfaces/input/question.input';
import { HttpError } from '@shared/error';
import type { QuestionEntity } from '../entities/question.entity';
import { toTestDto } from '../mappers/to-test.dto';

@injectable()
export class QuestionService {
	constructor(@inject(TM_TYPES.QUESTION_REPOSITORY) private readonly questionRepository: QuestionRepository) {}

	async create(input: CreateQuestionInput): Promise<QuestionDto> {
		const questionEntity = buildQuestionFromCreateInput(input);
		const errors = questionEntity.validate();

		if (errors.errors.length) {
			throw new HttpValidationError('validation_failed', 'QuestionService.create', errors);
		}

		const createdQuestion = await this.questionRepository.create(questionEntity);
		return toQuestionDto(createdQuestion);
	}

	async update(input: UpdateQuestionInput): Promise<QuestionDto> {
		const questionEntity = buildQuestionFromUpdateInput(input);
		const errors = questionEntity.validate();

		if (errors.errors.length) {
			throw new HttpValidationError('validation_failed', 'QuestionService.update', errors);
		}

		const updatedQuestion = await this.questionRepository.update(questionEntity);

		return toQuestionDto(updatedQuestion);
	}

	async delete(input: DeleteQuestionInput): Promise<void> {
		const isDeleted = await this.questionRepository.delete(QuestionId.of(input.id), TestId.of(input.testId));

		if (!isDeleted) {
			throw new HttpError(404, 'question_not_found', 'QuestionService.delete');
		}
	}

	async changeOrder(input: ChangeQuestionOrderInput): Promise<TestDto> {
		const { test, questionId, previousQuestionId, nextQuestionId } = input;

		if (!previousQuestionId && !nextQuestionId) {
			return toTestDto(test);
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

		const question: QuestionEntity = test.questions.find((question) => question.id.value === questionId)!;

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
			return toTestDto(test);
		}

		for (let i = 0; i < test.questions.length; i++) {
			test.questions[i]!.sortKey = (i + 1) * 1000;
		}

		await this.questionRepository.updateQuestionsOrders(test.questions);

		return toTestDto(test);
	}
}
