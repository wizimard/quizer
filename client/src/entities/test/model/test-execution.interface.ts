import type { QuestionExecution } from "@entities/question/model/question-execution.interface";
import type { TestExecuteResponseStatusEnum } from "@shared/api/generated";

export interface TestExecution {
	id: string;
	title: string;
	isOpen: boolean;
	openDate?: string;
	closeDate?: string;
	questions: Array<QuestionExecution>;
	status: TestExecuteResponseStatusEnum;
}
