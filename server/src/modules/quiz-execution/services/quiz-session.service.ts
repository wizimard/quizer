import { inject, injectable } from 'inversify';
import type { QuizExecutionRepository } from '@modules/quiz-management/interfaces/repository/quiz-execution.repository.interface';
import { QM_TYPES } from '@modules/quiz-management/quiz-management.types';
import type { StartQuizInput } from '../types/start-quiz.input';
import type { FinishQuizInput } from '../types/finish-quiz.input';
import type { ExecutableQuizDto } from '../dto/executable-quiz.dto';
import { toExecutableQuizDtoFromReadModel } from '../mappers/to-executable-quiz.dto';

@injectable()
export class QuizSessionService {
	constructor(@inject(QM_TYPES.QUIZ_EXECUTION_REPOSITORY) private readonly quizExecutionRepository: QuizExecutionRepository) {}

	async startQuiz(input: StartQuizInput): Promise<ExecutableQuizDto> {
		const quiz = await this.quizExecutionRepository.startQuiz(input.quiz.id, input.quiz.authorId, input.finishedAt);

		return toExecutableQuizDtoFromReadModel(quiz);
	}

	async finishQuiz(input: FinishQuizInput): Promise<ExecutableQuizDto> {
		const quiz = await this.quizExecutionRepository.finishQuiz(input.quiz.id, input.quiz.authorId);

		return toExecutableQuizDtoFromReadModel(quiz);
	}
}
