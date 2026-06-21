import { inject, injectable } from 'inversify';
import type { IQuizService } from './quiz.service.interface';
import { QUIZ_TYPES } from '../quiz.types';
import type { IQuizRepository, TQuizModelWithQuestions } from '../repositories/quiz.repository.interface';
import type { QuizCreateDto } from '../dto/quiz-create.dto';
import type { IQuizResponse } from '../dto/quiz-response.dto';
import { QuizMapper } from '../mappers/quiz.mapper';
import { HttpValidationError } from '../../error/http-validation.error';
import type { IQuizEntity } from '../entities/quiz.entity.interface';
import { HttpError } from '../../error/http.error';
import type { QuizUpdateDto } from '../dto/quiz-update.dto';
import { QuestionMapper } from '../mappers/question.mapper';
import type { IQuizValidationError } from '../errors/quiz-validation.errror';
import type { IQuestionEntity } from '../entities/question.entity.interface';
import type { BatchPayload } from '@prisma/internal/prismaNamespace';
import type { QuizModel } from '@prisma/client';
import type { IQuizExecuteResponse } from '../dto/quiz-execute-response.dto';

@injectable()
export class QuizService implements IQuizService {
	private readonly quizMapper: QuizMapper = new QuizMapper();
	private readonly questionMapper: QuestionMapper = new QuestionMapper();

	constructor(@inject(QUIZ_TYPES.QUIZ_REPOSITORY) private readonly quizRepository: IQuizRepository) {}

	async getById(quizId: string, userId: string): Promise<IQuizResponse> {
		const quizModel: TQuizModelWithQuestions = await this.getQuizById(quizId);

		if (quizModel.authorId !== userId) {
			throw new HttpError(403, 'quiz_not_author', 'QuizService getById');
		}

		return this.quizMapper.toResponseFromRepository(quizModel);
	}

	async getByAuthor(userId: string): Promise<IQuizResponse[]> {
		const quizModels: QuizModel[] | null = await this.quizRepository.getByAuthor(userId);

		if (!quizModels) {
			throw new HttpError(404, 'quizes_not_found', 'QuizService getByAuthor');
		}

		return quizModels.map((quizModel) => this.quizMapper.toResponseFromRepository(quizModel));
	}

	async create(quizCreateDto: QuizCreateDto, userId: string): Promise<IQuizResponse> {
		const quizEntity: IQuizEntity = this.quizMapper.toEntityFromCreateDto(quizCreateDto, userId);

		const errors: IQuizValidationError = quizEntity.validate();

		if (errors.errors.length || errors.questionsErrors.length) {
			throw new HttpValidationError('quiz_invalid_data', 'QuizService create', errors);
		}

		const newQuiz: TQuizModelWithQuestions | null = await this.quizRepository.create(quizEntity);

		if (!newQuiz) {
			throw new HttpError(500, 'quiz_create_error', 'QuizService create');
		}

		return this.quizMapper.toResponseFromRepository(newQuiz);
	}

	async update(quizUpdateDto: QuizUpdateDto, userId: string): Promise<IQuizResponse> {
		const quizModel: TQuizModelWithQuestions = await this.getQuizById(quizUpdateDto.id);

		if (quizModel.authorId !== userId) {
			throw new HttpError(403, 'quiz_not_author', 'QuizService update');
		}

		const quiz: IQuizEntity = this.quizMapper.toEntityFromRepositry(quizModel);

		const addQuestions: IQuestionEntity[] = [];
		const updateQuestions: IQuestionEntity[] = [];

		if (quizUpdateDto.add) {
			addQuestions.push(...quizUpdateDto.add.map((question) => this.questionMapper.toEntityFromCreateDto(question, quizModel.id)));
		}

		if (quizUpdateDto.update) {
			updateQuestions.push(...quizUpdateDto.update.map((question) => this.questionMapper.toEntityFromCreateDto(question, quizModel.id)));
		}

		if (quizUpdateDto.title) {
			quiz.title = quizUpdateDto.title;
		}

		const validationData: IQuizValidationError = quiz.validate();

		if (quizUpdateDto.delete && [...addQuestions, ...updateQuestions].find((question) => quizUpdateDto.delete?.includes(question.id))) {
			validationData.errors.push({
				path: 'delete',
				message: 'include_in_questions',
			});
		}

		if (validationData.errors.length || validationData.questionsErrors.length) {
			throw new HttpValidationError('quiz_validation_fail', 'QuizService update', validationData);
		}

		const updatedQuiz: TQuizModelWithQuestions | null = await this.quizRepository.update(quiz, addQuestions, updateQuestions, quizUpdateDto.delete ?? []);

		if (!updatedQuiz) {
			throw new HttpError(500, 'quiz_update_error', 'QuizService update');
		}

		return this.quizMapper.toResponseFromRepository(updatedQuiz);
	}

	async delete(quizId: string, userId: string): Promise<void> {
		const quizModel: TQuizModelWithQuestions = await this.getQuizById(quizId);

		if (quizModel.authorId !== userId) {
			throw new HttpError(403, 'quiz_not_author', 'QuizService delete');
		}

		const quizDeleteResult: [BatchPayload, TQuizModelWithQuestions] | null = await this.quizRepository.delete(quizId);

		if (!quizDeleteResult) {
			throw new HttpError(500, 'quiz_not_delete', 'QuizService delete');
		}

		return;
	}

	private async getQuizById(id: string): Promise<TQuizModelWithQuestions> | never {
		const quizModel: TQuizModelWithQuestions | null = await this.quizRepository.getById(id);

		if (!quizModel) {
			throw new HttpError(404, 'quiz_not_found', 'QuizService');
		}

		return quizModel;
	}

	public async getByIdForExecute(quizId: string): Promise<IQuizExecuteResponse> {
		const quizModel = await this.getQuizById(quizId);

		return this.quizMapper.toResponseExecuteFromRepository(quizModel);
	}
}
