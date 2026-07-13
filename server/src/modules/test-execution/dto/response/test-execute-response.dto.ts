import type { QuestionExecuteResponse } from './question-execute-response.dto';

export interface TestExecuteResponse {
	id: string;
	title: string;
	is_open: boolean;
	open_from_at?: Date;
	open_until_at?: Date;
	questions: Array<QuestionExecuteResponse>;
	register_credentials: Array<string>;
}
