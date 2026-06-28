import type { IQuestionResponse } from '../types/questions-response.interface';

export interface IQuestionService {
	getQuestion(quizId: string, questionId: string): Promise<IQuestionResponse>;
}
