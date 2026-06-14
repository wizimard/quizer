import type { QuestionRequest, QuestionRequestConfig } from "@shared/api/generated";

export interface QuestionExecute extends Omit<QuestionRequest, "config"> {
	config: Omit<QuestionRequestConfig, "answer">;
}

export type QuestionExecuteViewConfig = QuestionRequestConfig extends infer T ? (T extends { answer: infer A } ? T & { userAnswer: A } : never) : never;

export interface QuestionExecuteView extends QuestionExecute {
	config: QuestionExecuteViewConfig;
}
