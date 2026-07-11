import type { QuestionRequestConfig } from "@shared/api/generated";

export interface Question {
	id: string;
	testId: string;
	sortKey: number;
	description: string;
	config: QuestionRequestConfig;
}
