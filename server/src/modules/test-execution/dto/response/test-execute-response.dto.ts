import type { TestStatus } from '@modules/test-management/entities/test.entity';
import type { QuestionExecuteResponse } from './question-execute-response.dto';

export interface TestExecuteResponse {
	id: string;
	title: string;
	status: TestStatus;
	open_from_at?: Date;
	open_until_at?: Date;
	questions: Array<QuestionExecuteResponse>;
}
