import type { IQuestionResponse } from './question-response.interface';
import type { TestStatus } from '@modules/test-management/entities/test.entity';
import type { ITestSettingsResponse } from './test-settings-response.interface';

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
	settings: ITestSettingsResponse;
}
