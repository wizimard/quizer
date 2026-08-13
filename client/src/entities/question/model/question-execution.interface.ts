import type { Question } from "./question.interface";
import type { QuestionExecuteConfig } from "@shared/api/generated";

export interface QuestionExecution extends Omit<Question, "config" | "score"> {
	config: QuestionExecuteConfig;
}
