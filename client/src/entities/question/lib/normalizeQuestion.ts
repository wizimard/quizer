import type { QuestionExecution } from "../model/question-execution.interface";
import type { Question } from "../model/question.interface";
import type { QuestionExecuteResponse, QuestionResponse } from "@shared/api/generated";

export function normalizeQuestion(question: QuestionResponse): Question {
	return {
		id: question.id,
		testId: question.test_id,
		sortKey: question.sort_key,
		description: question.description,
		config: question.config,
	};
}

export function normalizeExecutionQuestion(question: QuestionExecuteResponse): QuestionExecution {
	const config = question.config;

	return {
		id: question.id,
		testId: question.test_id,
		sortKey: question.sort_key,
		description: question.description,
		config,
	};
}
