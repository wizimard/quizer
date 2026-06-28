import type { IQuestionResponse } from './questions-response.interface';
import type { IQuizSettingsBase } from '../entities/quiz-settings.interface';

export interface IQuizResponse {
	id: string;
	authorId: string;
	title: string;
	questions: Array<IQuestionResponse>;
	settings: IQuizSettingsBase;
	updatedAt: Date;
	createdAt: Date;
}
