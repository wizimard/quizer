import type { Question } from "../model/question.interface";
import type { QuestionResponse } from "@shared/api/generated";

export function normalizeQuestion(question: QuestionResponse): Question {
	return {
		id: question.id,
		testId: question.test_id,
		sortKey: question.sort_key,
		description: question.description,
		config: question.config,
	};
}
