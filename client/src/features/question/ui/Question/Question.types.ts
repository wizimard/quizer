import type { QuestionRequest } from "@shared/api/generated";

export enum QUESTION_MODES {
	EXECUTE = "execute",
	VIEW = "view",
}

export interface IQuestionExecute {
	mode: QUESTION_MODES.EXECUTE;
	question: unknown;
}

export interface IQuestionView {
	mode: QUESTION_MODES.VIEW;
	question: QuestionRequest;
}

export type TQuestionProps = IQuestionExecute | IQuestionView;
