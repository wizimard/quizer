import type { IQuestionResponse } from './question-response.interface';
import type { ITestSettings } from '../../interfaces/entities/test-settings.interface';
import type { TestStatus } from '@modules/test-management/entities/test.entity';

export interface ITestResponseBase {
	id: string;
	authorId: string;
	status: TestStatus;
	title: string;
	updatedAt: Date;
	createdAt: Date;
}

export interface ITestResponse extends ITestResponseBase {
	questions: Array<IQuestionResponse>;
	settings: ITestSettings;
}
