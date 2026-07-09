import type { IQuestionResponse } from './question-response.interface';
import type { ITestSettingsBase } from '../test-settings.interface';
import type { TestSessionStatus } from '@prisma/enums';

export interface ITestResponseBase {
	id: string;
	authorId: string;
	status: TestSessionStatus;
	title: string;
	updatedAt: Date;
	createdAt: Date;
}

export interface ITestResponse extends ITestResponseBase {
	questions: Array<IQuestionResponse>;
	settings: ITestSettingsBase;
}
