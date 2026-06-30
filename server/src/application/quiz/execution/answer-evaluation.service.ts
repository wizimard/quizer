import { inject, injectable } from 'inversify';
import type { QuizQuestionModel } from '@prisma/client';
import { HttpError } from '@error';
import { isQuestionType } from '@domain/quiz/question-configs/question-config.registry';
import type { IQuestionRepository } from '@infrastructure/persistence/prisma/question.repository.interface';
import { QUIZ_TYPES } from '@composition/quiz.types';
import type { IAnswerEvaluationResponse } from '@interfaces/http/quiz/types/answer-evaluation-response.interface';
import { evaluateAnswer } from './answer-evaluator.registry';
import type { IAnswerEvaluationService } from './answer-evaluation.service.interface';

@injectable()
export class AnswerEvaluationService implements IAnswerEvaluationService {
	constructor(@inject(QUIZ_TYPES.QUESTION_REPOSITORY) private readonly questionRepository: IQuestionRepository) {}

	async evaluateAnswer(quizId: string, questionId: string, submittedAnswer: unknown): Promise<IAnswerEvaluationResponse> {
		const questionModel: QuizQuestionModel | null = await this.questionRepository.getQuestion(quizId, questionId);

		if (!questionModel) {
			throw new HttpError(404, 'question_not_found');
		}

		const config = questionModel.config;

		if (!config || typeof config !== 'object' || Array.isArray(config) || !('type' in config)) {
			throw new HttpError(500, 'question_config_invalid');
		}

		const questionType = config.type;

		if (typeof questionType !== 'string' || !isQuestionType(questionType)) {
			throw new HttpError(500, 'unknown_question_type');
		}

		return {
			correct: evaluateAnswer(questionType, config, submittedAnswer),
		};
	}
}
