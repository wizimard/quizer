import type { TQuestionForm } from "../model/question-form";
import { api } from "@shared/api";
import type { QuestionResponse, QuestionUpdateRequestBody } from "@shared/api/generated";

export function updateQuestion(question: QuestionResponse, data: TQuestionForm) {
	if (!data.config) {
		throw new Error("Config is required");
	}

	const requestBody: QuestionUpdateRequestBody = {
		description: data.description,
		config: data.config,
	};

	return api.questionQuizIdQuestionsQuestionIdPatch(question.quizId, question.id, requestBody);
}
