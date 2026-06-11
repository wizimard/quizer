import type { QuestionRequest, QuestionRequestConfig } from "@shared/api/generated";

export interface IQuestion extends QuestionRequest {
	config: QuestionRequestConfig | null;
}
