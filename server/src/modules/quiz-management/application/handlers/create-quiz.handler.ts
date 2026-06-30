import { inject, injectable } from 'inversify';
import { QM_TYPES } from '../../quiz-management.types';
import { QuizValidationFailedError } from '../../domain/errors/quiz-validation-failed.error';
import type { QuizRepository } from '../../domain/repositories/quiz.repository.port';
import type { CreateQuizCommand } from '../commands/create-quiz.command';
import type { QuizDto } from '../dto/quiz.dto';
import { buildQuizFromCreateCommand } from '../mappers/quiz-entity.mapper';
import { toQuizDto } from '../mappers/to-quiz.dto';

@injectable()
export class CreateQuizHandler {
	constructor(@inject(QM_TYPES.QUIZ_REPOSITORY) private readonly quizRepository: QuizRepository) {}

	async execute(command: CreateQuizCommand): Promise<QuizDto> {
		const quizEntity = buildQuizFromCreateCommand(command);
		const errors = quizEntity.validate();

		if (errors.errors.length || errors.questionsErrors.length) {
			throw new QuizValidationFailedError(errors);
		}

		const createdQuiz = await this.quizRepository.create(quizEntity);

		return toQuizDto(createdQuiz);
	}
}
