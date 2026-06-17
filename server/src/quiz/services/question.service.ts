import { inject, injectable } from 'inversify';
import type { IQuestionService } from './question.service.interface';
import type { IQuestionResponse } from '../dto/questions-response.interface';
import { QUIZ_TYPES } from '../quiz.types';
import type { IQuestionRepository } from '../repositories/question.repository.interface';
import type { QuizQuestionModel } from '@prisma/client';
import { HttpError } from '../../error/http.error';
import { QuestionMapper } from '../mappers/question.mapper';

@injectable()
export class QuestionService implements IQuestionService {
	private readonly questionMapper = new QuestionMapper();

	constructor(@inject(QUIZ_TYPES.QUESTION_REPOSITORY) private readonly questionRepository: IQuestionRepository) {}

	async getQuestion(quizId: string, questionId: string): Promise<IQuestionResponse> {
		const questionModel: QuizQuestionModel | null = await this.questionRepository.getQuestion(quizId, questionId);

		if (!questionModel) {
			throw new HttpError(404, 'quiz not found');
		}

		return this.questionMapper.toResponseExecuteFromRepository(questionModel);
	}
}
