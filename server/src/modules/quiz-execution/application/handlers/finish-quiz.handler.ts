import { inject, injectable } from 'inversify';
import { QuizId } from '@modules/quiz-management/domain/value-objects/quiz-id.vo';
import type { QuizExecutionRepository } from '../../domain/repositories/quiz-execution.repository.port';
import { QE_TYPES } from '../../quiz-execution.types';
import type { FinishQuizCommand } from '../commands/finish-quiz.command';
import type { ExecutableQuizDto } from '../dto/executable-quiz.dto';
import { toExecutableQuizDtoFromReadModel } from '../mappers/to-executable-quiz.dto';

@injectable()
export class FinishQuizHandler {
	constructor(@inject(QE_TYPES.QUIZ_EXECUTION_REPOSITORY) private readonly quizExecutionRepository: QuizExecutionRepository) {}

	async execute(command: FinishQuizCommand): Promise<ExecutableQuizDto> {
		const quiz = await this.quizExecutionRepository.finishQuiz(QuizId.of(command.quizId));

		return toExecutableQuizDtoFromReadModel(quiz);
	}
}
