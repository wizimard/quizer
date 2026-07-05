import { inject, injectable } from 'inversify';
import { QM_TYPES } from '@modules/quiz-management/quiz-management.types';
import { QuizNotFoundError } from '@modules/quiz-management/utils/errors/quiz-not-found.error';
import type { QuizRepository } from '@modules/quiz-management/interfaces/repository/quiz.repository.interface';
import { QuizId } from '@modules/quiz-management/entities/value-object/quiz-id';
import { QuestionNotFoundError } from '@modules/quiz-management/utils/errors/question-not-found.error';
import { evaluateAnswer } from './answer-evaluation/answer-evaluator.registry';
import type { QuestionReadRepository } from '../repositories/question-read.repository.interface';
import { QE_TYPES } from '../quiz-execution.types';
import type { EvaluateAnswerInput } from '../types/evaluate-answer.input';
import type { GetQuizForExecutionInput } from '../types/get-quiz-for-execution.input';
import type { GetQuestionForExecutionInput } from '../types/get-question-for-execution.input';
import type { EvaluationResultDto } from '../dto/evaluation-result.dto';
import type { ExecutableQuizDto } from '../dto/executable-quiz.dto';
import type { QuestionExecuteDto } from '../dto/question-execute.dto';
import { toExecutableQuizDto } from '../mappers/to-executable-quiz.dto';
import { toQuestionExecuteDto } from '../mappers/to-question-execute.dto';

@injectable()
export class QuizExecutionService {
	constructor(
		@inject(QM_TYPES.QUIZ_REPOSITORY) private readonly quizRepository: QuizRepository,
		@inject(QE_TYPES.QUESTION_READ_REPOSITORY) private readonly questionRepository: QuestionReadRepository,
	) {}

	async getQuiz(input: GetQuizForExecutionInput): Promise<ExecutableQuizDto> {
		const quiz = await this.quizRepository.findFullById(QuizId.of(input.quizId));

		if (!quiz) {
			throw new QuizNotFoundError('QuizExecutionService.getQuiz');
		}

		return toExecutableQuizDto(quiz);
	}

	async getQuestion(input: GetQuestionForExecutionInput): Promise<QuestionExecuteDto> {
		const question = await this.questionRepository.findById(QuizId.of(input.quizId), input.questionId);

		if (!question) {
			throw new QuestionNotFoundError('QuizExecutionService.getQuestion');
		}

		return toQuestionExecuteDto(question);
	}

	async evaluateAnswer(input: EvaluateAnswerInput): Promise<EvaluationResultDto> {
		const question = await this.questionRepository.findById(QuizId.of(input.quizId), input.questionId);

		if (!question) {
			throw new QuestionNotFoundError('QuizExecutionService.evaluateAnswer');
		}

		const isCorrect = evaluateAnswer(question.config, input.answer);

		return { correct: isCorrect };
	}
}
