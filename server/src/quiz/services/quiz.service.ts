import { inject, injectable } from 'inversify';
import type { IQuizService } from './quiz.service.interface';
import { QUIZ_TYPES } from '../quiz.types';
import type { IQuizRepository, IQuizUpdateSettingsData, TQuizModelAll } from '../repositories/quiz.repository.interface';
import type { QuizCreateDto } from '../dto/quiz-create.dto';
import type { IQuizResponse } from '../types/quiz-response.interface';
import { QuizMapper } from '../mappers/quiz.mapper';
import { HttpValidationError } from '../../error/http-validation.error';
import type { IQuizEntity } from '../entities/quiz.entity.interface';
import { HttpError } from '../../error/http.error';
import type { QuizUpdateDto } from '../dto/quiz-update.dto';
import { QuestionMapper } from '../mappers/question.mapper';
import type { IQuizValidationError } from '../errors/quiz-validation.errror';
import type { IQuestionEntity } from '../entities/question.entity.interface';
import type { QuizModel } from '@prisma/client';
import type { IQuizExecuteResponse } from '../types/quiz-execute-response.interface';
import type { QuizSettingsUpdateDto } from '../dto/quiz-settings-update.dto';
import { QuizAvailablePeriod } from '../entities/quiz-available-period';

@injectable()
export class QuizService implements IQuizService {
	private readonly quizMapper: QuizMapper = new QuizMapper();
	private readonly questionMapper: QuestionMapper = new QuestionMapper();

	constructor(@inject(QUIZ_TYPES.QUIZ_REPOSITORY) private readonly quizRepository: IQuizRepository) {}

	async getById(quizId: string, userId: string): Promise<IQuizResponse> {
		const quizModel: TQuizModelAll = await this.getFullQuizById(quizId);

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

		const newQuiz: TQuizModelAll | null = await this.quizRepository.create(quizEntity);

		if (!newQuiz) {
			throw new HttpError(500, 'quiz_create_error', 'QuizService create');
		}

		return this.quizMapper.toResponseFromRepository(newQuiz);
	}

	async update(quizUpdateDto: QuizUpdateDto, userId: string): Promise<IQuizResponse> {
		const quizModel: TQuizModelAll = await this.getFullQuizById(quizUpdateDto.id);

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

		const updatedQuiz: TQuizModelAll | null = await this.quizRepository.update(quiz, addQuestions, updateQuestions, quizUpdateDto.delete ?? []);

		if (!updatedQuiz) {
			throw new HttpError(500, 'quiz_update_error', 'QuizService update');
		}

		return this.quizMapper.toResponseFromRepository(updatedQuiz);
	}

	async delete(quizId: string, userId: string): Promise<void> {
		const quizModel: QuizModel = await this.getQuizById(quizId);

		if (quizModel.authorId !== userId) {
			throw new HttpError(403, 'quiz_not_author', 'QuizService delete');
		}

		const quizDeleteResult: QuizModel | null = await this.quizRepository.delete(quizId);

		if (!quizDeleteResult) {
			throw new HttpError(500, 'quiz_not_delete', 'QuizService delete');
		}

		return;
	}

	private async getQuizById(id: string): Promise<QuizModel> | never {
		const quizModel: QuizModel | null = await this.quizRepository.getById(id);

		if (!quizModel) {
			throw new HttpError(404, 'quiz_not_found', 'QuizService');
		}

		return quizModel;
	}

	private async getFullQuizById(id: string): Promise<TQuizModelAll> | never {
		const quizModel: TQuizModelAll | null = await this.quizRepository.getFullById(id);

		if (!quizModel) {
			throw new HttpError(404, 'quiz_not_found', 'QuizService');
		}

		return quizModel;
	}

	public async getByIdForExecute(quizId: string): Promise<IQuizExecuteResponse> {
		const quizModel = await this.getQuizById(quizId);

		return this.quizMapper.toResponseExecuteFromRepository(quizModel);
	}

	public async updateSettings(quizId: string, settingsDto: QuizSettingsUpdateDto, userId: string): Promise<IQuizResponse> {
		const quizModel: TQuizModelAll = await this.getFullQuizById(quizId);

		if (quizModel.authorId !== userId) {
			throw new HttpError(403, 'quiz_not_author', 'QuizService updateSettings');
		}

		const updateSettingsData: IQuizUpdateSettingsData = {
			isRequiredEmail: settingsDto.isRequiredEmail,
			isRequiredFirstName: settingsDto.isRequiredFirstName,
			isRequiredLastName: settingsDto.isRequiredLastName,
			isShowAnswersAfterCompletion: settingsDto.isShowAnswersAfterCompletion,
		};

		if (settingsDto.available_periods) {
			updateSettingsData.availablePeriods = {};

			if (settingsDto.available_periods.add) {
				updateSettingsData.availablePeriods.add = settingsDto.available_periods.add.map((period) => new QuizAvailablePeriod(0, quizModel.id, period.available_from, period.available_to));
			}

			if (settingsDto.available_periods.update) {
				updateSettingsData.availablePeriods.update = settingsDto.available_periods.update.map(
					(period) => new QuizAvailablePeriod(Number(period.id), quizModel.id, period.available_from, period.available_to),
				);
			}

			if (settingsDto.available_periods.remove) {
				updateSettingsData.availablePeriods.remove = settingsDto.available_periods.remove;
			}
		}

		const updatedQuiz: TQuizModelAll | null = await this.quizRepository.updateSettings(quizId, updateSettingsData);

		if (!updatedQuiz) {
			throw new HttpError(500, 'quiz_update_settings_error', 'QuizService updateSettings');
		}

		return this.quizMapper.toResponseFromRepository(updatedQuiz);
	}
}
