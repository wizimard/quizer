import type { IQuestionResponse } from '@interfaces/http/quiz/types/questions-response.interface';

export interface IQuestionService {
	getQuestion(quizId: string, questionId: string): Promise<IQuestionResponse>;
}
