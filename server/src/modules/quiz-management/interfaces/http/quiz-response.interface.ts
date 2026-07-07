import type { IQuestionResponse } from './question-response.interface';
import type { IQuizSettingsBase } from '../quiz-settings.interface';

export type TQuizStatus = 'scheduler' | 'open_by_scheduler' | 'manual_open' | 'closed';

export interface IQuizResponseBase {
	id: string;
	authorId: string;
	status: TQuizStatus;
	title: string;
	updatedAt: Date;
	createdAt: Date;
}

export interface IQuizResponse extends IQuizResponseBase {
	questions: Array<IQuestionResponse>;
	settings: IQuizSettingsBase;
}
