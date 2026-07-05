import type { QuestionRequestConfig, QuestionResponse } from "@shared/api/generated";

export interface IQuestion extends Omit<QuestionResponse, "config"> {
	config: QuestionRequestConfig | null;
}
