import { HttpValidationError } from '@shared/error/http-validation.error';
import { inject, injectable } from 'inversify';
import type { QuestionDto } from '../dto/quiz.dto';
import type { QuestionRepository } from '../interfaces/repository/question.repository.interface';
import { buildQuestionFromCreateInput, buildQuestionFromUpdateInput, toQuestionDto } from '../mappers/question-entity.mapper';
import { QuestionId } from '../entities/value-object/question-id';
import { QuizId } from '../entities/value-object/quiz-id';
import { QM_TYPES } from '../quiz-management.types';
import type { CreateQuestionInput, DeleteQuestionInput, UpdateQuestionInput } from '../interfaces/input/question.input';
import { HttpError } from '@shared/error';

@injectable()
export class QuestionService {
	constructor(@inject(QM_TYPES.QUESTION_REPOSITORY) private readonly questionRepository: QuestionRepository) {}

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
		const isDeleted = await this.questionRepository.delete(QuestionId.of(input.id), QuizId.of(input.quizId));

		if (!isDeleted) {
			throw new HttpError(404, 'question_not_found', 'QuestionService.delete');
		}
	}
}
