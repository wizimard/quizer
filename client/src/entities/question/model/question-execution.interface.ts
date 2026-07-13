import type { Question } from "./question.interface";

export type QuestionExecutionConfig = Omit<Question["config"], "answer">;

export interface QuestionExecution extends Omit<Question, "config"> {
	config: QuestionExecutionConfig;
}
