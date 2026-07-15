import type { QuestionExecuteResponse } from './question-execute-response.dto';

export interface TestRegisteredUserResponse {
	id: string;

	first_name: string;
	last_name: string;

	current_question: QuestionExecuteResponse | null;

	current_question_index: number;
	total_questions_count: number;
}
