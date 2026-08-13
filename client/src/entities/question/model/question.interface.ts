import type { QuestionRequestConfig } from "@shared/api/generated";

export interface Question {
	id: string;
	testId: string;
	sortKey: number;
	description: string;
	score: number;
	image: string | null;
	config: QuestionRequestConfig;
}
