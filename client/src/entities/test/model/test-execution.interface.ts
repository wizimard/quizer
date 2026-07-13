import type { QuestionExecution } from "@entities/question/model/question-execution.interface";

export interface TestExecution {
	id: string;
	title: string;
	isOpen: boolean;
	openDate?: string;
	closeDate?: string;
	questions: Array<QuestionExecution>;
	register_credentials: Array<string>;
}
