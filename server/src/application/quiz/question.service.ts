import { inject, injectable } from 'inversify';
import type { IQuestionService } from './question.service.interface';
import type { IQuestionResponse } from '@interfaces/http/quiz/types/questions-response.interface';
import { QUIZ_TYPES } from '@composition/quiz.types';
import type { IQuestionRepository } from '@infrastructure/persistence/prisma/question.repository.interface';
import type { QuizQuestionModel } from '@prisma/client';
import { HttpError } from '@error';
import { QuestionMapper } from '@infrastructure/persistence/mappers/question.mapper';

@injectable()
export class QuestionService implements IQuestionService {
	constructor(
		@inject(QUIZ_TYPES.QUESTION_REPOSITORY) private readonly questionRepository: IQuestionRepository,
		@inject(QUIZ_TYPES.QUESTION_MAPPER) private readonly questionMapper: QuestionMapper,
	) {}

	async getQuestion(quizId: string, questionId: string): Promise<IQuestionResponse> {
		const questionModel: QuizQuestionModel | null = await this.questionRepository.getQuestion(quizId, questionId);

		if (!questionModel) {
			throw new HttpError(404, 'quiz not found');
		}

		return this.questionMapper.toResponseExecuteFromRepository(questionModel);
	}
}
