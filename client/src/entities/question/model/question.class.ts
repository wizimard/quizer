import type { QuestionRequestConfig } from "@shared/api/generated";
import type { IQuestion } from "./question.interface";

export enum QUESTION_TYPES {
	INPUT = "input",
	SIGNLE_CHOISE = "single_choise",
	MULTIPLE_CHOISE = "multiple_choise",
	ORDER = "order",
}

export class Question implements IQuestion {
	constructor(
		public id: string,
		public quizId: string,
		public order: number,
		public description: string,
		public config: QuestionRequestConfig | null = null,
	) {}
}
