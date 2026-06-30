import { inject, injectable } from 'inversify';
import { QuizId } from '@modules/quiz-management/domain/value-objects/quiz-id.vo';
import type { QuizExecutionRepository } from '../../domain/repositories/quiz-execution.repository.port';
import { QE_TYPES } from '../../quiz-execution.types';
import type { StartQuizCommand } from '../commands/start-quiz.command';
import type { ExecutableQuizDto } from '../dto/executable-quiz.dto';
import { toExecutableQuizDtoFromReadModel } from '../mappers/to-executable-quiz.dto';

@injectable()
export class StartQuizHandler {
	constructor(@inject(QE_TYPES.QUIZ_EXECUTION_REPOSITORY) private readonly quizExecutionRepository: QuizExecutionRepository) {}

	async execute(command: StartQuizCommand): Promise<ExecutableQuizDto> {
		const quiz = await this.quizExecutionRepository.startQuiz(QuizId.of(command.quizId));

		return toExecutableQuizDtoFromReadModel(quiz);
	}
}
