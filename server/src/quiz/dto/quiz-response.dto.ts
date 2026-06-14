import type { IQuestionResponse } from './questions-response.interface';

export interface IQuizResponse {
	id: string;
	authorId: string;
	title: string;
	questions: IQuestionResponse[];
	updatedAt: Date;
	createdAt: Date;
}
