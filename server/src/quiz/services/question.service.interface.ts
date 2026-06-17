import type { IQuestionResponse } from '../dto/questions-response.interface';

export interface IQuestionService {
	getQuestion(quizId: string, questionId: string): Promise<IQuestionResponse>;
}
