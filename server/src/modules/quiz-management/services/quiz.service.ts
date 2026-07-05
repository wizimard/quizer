import { UserId } from '@modules/identity-access';
import { inject, injectable } from 'inversify';
import { QM_TYPES } from '../quiz-management.types';
import { QuizSettings } from '../entities/quiz-settings';
import { QuizValidationFailedError } from '../utils/errors/quiz-validation-failed.error';
import type { QuizRepository } from '../interfaces/repository/quiz.repository.interface';
import type { QuizDto } from '../dto/quiz.dto';
import { buildQuizFromCreateInput } from '../mappers/quiz-entity.mapper';
import { toQuizDto } from '../mappers/to-quiz.dto';
import { QuizValidator } from '../utils/validators/quiz.validator';
import type { CreateQuizInput, GetQuizzesByAuthorInput, UpdateQuizAvailablePeriodsInput, UpdateQuizInput, UpdateQuizSettingsInput } from '../interfaces/input/quiz.input';
import type { QuizEntity } from '../entities/quiz.entity';

@injectable()
export class QuizService {
	constructor(@inject(QM_TYPES.QUIZ_REPOSITORY) private readonly quizRepository: QuizRepository) {}

	async create(input: CreateQuizInput): Promise<QuizDto> {
		const quizEntity = buildQuizFromCreateInput(input);
		const errors = QuizValidator.validate(quizEntity);

		if (errors.errors.length || errors.questionsErrors.length) {
			throw new QuizValidationFailedError(errors, 'QuizService.create');
		}

		const createdQuiz = await this.quizRepository.create(quizEntity);

		return toQuizDto(createdQuiz);
	}

	async update(quiz: QuizEntity, input: UpdateQuizInput): Promise<QuizDto> {
		if (input.title) {
			quiz.updateTitle(input.title);
		}

		const updatedQuiz = await this.quizRepository.update(quiz);

		return toQuizDto(updatedQuiz);
	}

	async delete(quiz: QuizEntity): Promise<void> {
		await this.quizRepository.delete(quiz.id);
	}

	async getByAuthor(input: GetQuizzesByAuthorInput): Promise<QuizDto[]> {
		const quizzes = await this.quizRepository.findByAuthor(UserId.of(input.authorId));

		return quizzes.map(toQuizDto);
	}

	async updateSettings(quiz: QuizEntity, input: UpdateQuizSettingsInput): Promise<QuizDto> {
		const updateSettingsData = QuizSettings.buildUpdateData({
			title: input.title,
			isRequiredEmail: input.isRequiredEmail,
			isRequiredFirstName: input.isRequiredFirstName,
			isRequiredLastName: input.isRequiredLastName,
			isShowAnswersAfterCompletion: input.isShowAnswersAfterCompletion,
		});

		const updatedQuiz = await this.quizRepository.updateSettings(quiz.id, updateSettingsData);

		return toQuizDto(updatedQuiz);
	}

	async updateAvailablePeriods(quiz: QuizEntity, input: UpdateQuizAvailablePeriodsInput): Promise<QuizDto> {
		const updateData = QuizSettings.buildAvailablePeriodsUpdateData(quiz.id, input.availablePeriods);
		const updatedQuiz = await this.quizRepository.updateAvailablePeriods(quiz.id, updateData);

		return toQuizDto(updatedQuiz);
	}
}
