import { inject, injectable } from 'inversify';
import type { IQuizService } from './quiz.service.interface';
import { QUIZ_TYPES } from '@composition/quiz.types';
import type { QuizRepository } from '@domain/quiz/ports/quiz.repository.port';
import type { QuizCreateDto } from '@interfaces/http/quiz/dto/quiz-create.dto';
import type { IQuizResponse } from '@interfaces/http/quiz/types/quiz-response.interface';
import { QuizMapper } from '@infrastructure/persistence/mappers/quiz.mapper';
import { HttpValidationError } from '@error';
import type { IQuizEntity } from '@domain/quiz/quiz.entity.interface';
import type { QuizUpdateDto } from '@interfaces/http/quiz/dto/quiz-update.dto';
import { QuestionMapper } from '@infrastructure/persistence/mappers/question.mapper';
import type { IQuizValidationError } from '@domain/quiz/errors/quiz-validation.errror';
import type { IQuestionEntity } from '@domain/quiz/question.entity.interface';
import type { IQuizExecuteResponse } from '@interfaces/http/quiz/types/quiz-execute-response.interface';
import type { QuizSettingsUpdateDto } from '@interfaces/http/quiz/dto/quiz-settings-update.dto';
import { QuizSettings } from '@domain/quiz/quiz-settings';
import type { IQuizQueryService } from './quiz-query.service.interface';
import type { QuizModel } from '@prisma/client';

@injectable()
export class QuizService implements IQuizService {
	constructor(
		@inject(QUIZ_TYPES.QUIZ_REPOSITORY) private readonly quizRepository: QuizRepository,
		@inject(QUIZ_TYPES.QUIZ_QUERY_SERVICE) private readonly quizQueryService: IQuizQueryService,
		@inject(QUIZ_TYPES.QUIZ_MAPPER) private readonly quizMapper: QuizMapper,
		@inject(QUIZ_TYPES.QUESTION_MAPPER) private readonly questionMapper: QuestionMapper,
	) {}

	async getById(quizId: string, userId: string): Promise<IQuizResponse> {
		const quiz = await this.quizQueryService.getFullById(quizId);

		quiz.assertOwnedBy(userId);

		return this.quizMapper.toResponseFromEntity(quiz);
	}

	async getByAuthor(userId: string): Promise<IQuizResponse[]> {
		const quizzes = await this.quizRepository.findByAuthor(userId);

		return quizzes.map((quiz) => this.quizMapper.toResponseFromEntity(quiz));
	}

	async create(quizCreateDto: QuizCreateDto, userId: string): Promise<IQuizResponse> {
		const quizEntity: IQuizEntity = this.quizMapper.toEntityFromCreateDto(quizCreateDto, userId);

		const errors: IQuizValidationError = quizEntity.validate();

		if (errors.errors.length || errors.questionsErrors.length) {
			throw new HttpValidationError('quiz_invalid_data', 'QuizService create', errors);
		}

		const newQuiz = await this.quizRepository.create(quizEntity);

		return this.quizMapper.toResponseFromEntity(newQuiz);
	}

	async update(quizUpdateDto: QuizUpdateDto, userId: string): Promise<IQuizResponse> {
		const quiz = await this.quizQueryService.getFullById(quizUpdateDto.id);

		quiz.assertOwnedBy(userId);

		const addQuestions: IQuestionEntity[] = [];
		const updateQuestions: IQuestionEntity[] = [];

		if (quizUpdateDto.add) {
			addQuestions.push(...quizUpdateDto.add.map((question) => this.questionMapper.toEntityFromCreateDto(question, quiz.id)));
		}

		if (quizUpdateDto.update) {
			updateQuestions.push(...quizUpdateDto.update.map((question) => this.questionMapper.toEntityFromCreateDto(question, quiz.id)));
		}

		if (quizUpdateDto.title) {
			quiz.updateTitle(quizUpdateDto.title);
		}

		const validationData = quiz.validateUpdate(quizUpdateDto.delete ?? [], addQuestions, updateQuestions);

		if (validationData.errors.length || validationData.questionsErrors.length) {
			throw new HttpValidationError('quiz_validation_fail', 'QuizService update', validationData);
		}

		const updatedQuiz = await this.quizRepository.update(quiz, addQuestions, updateQuestions, quizUpdateDto.delete ?? []);

		return this.quizMapper.toResponseFromEntity(updatedQuiz);
	}

	async delete(quizId: string, userId: string): Promise<void> {
		const quiz = await this.quizQueryService.getById(quizId);

		quiz.assertOwnedBy(userId);

		await this.quizRepository.delete(quizId);
	}

	public async getByIdForExecute(quizId: string): Promise<IQuizExecuteResponse> {
		const quiz = await this.quizQueryService.getFullById(quizId);

		return this.quizMapper.toResponseExecuteFromEntity(quiz);
	}

	public async updateSettings(quizId: string, settingsDto: QuizSettingsUpdateDto, userId: string): Promise<IQuizResponse> {
		const quiz = await this.quizQueryService.getFullById(quizId);

		quiz.assertOwnedBy(userId);

		const updateSettingsData = QuizSettings.buildUpdateData(
			quiz.id,
			{
				isRequiredEmail: settingsDto.isRequiredEmail,
				isRequiredFirstName: settingsDto.isRequiredFirstName,
				isRequiredLastName: settingsDto.isRequiredLastName,
				isShowAnswersAfterCompletion: settingsDto.isShowAnswersAfterCompletion,
			},
			settingsDto.available_periods,
		);

		const updatedQuiz = await this.quizRepository.updateSettings(quizId, updateSettingsData);

		return this.quizMapper.toResponseFromEntity(updatedQuiz);
	}

	public async startQuiz(quizId: string): Promise<IQuizExecuteResponse> {
		const quiz = await this.quizRepository.startQuiz(quizId);

		return this.quizMapper.toResponseExecuteFromRepository(quiz);
	}

	public async finishQuiz(quizId: string): Promise<IQuizExecuteResponse> {
		const quiz = await this.quizRepository.finishQuiz(quizId);

		return this.quizMapper.toResponseExecuteFromRepository(quiz);
	}
}
