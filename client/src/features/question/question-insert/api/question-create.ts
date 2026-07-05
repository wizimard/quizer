import type { TQuestionForm } from "../model/question-form";
import { api } from "@shared/api";
import type { QuestionResponse, QuestionCreateRequestBody } from "@shared/api/generated";

export function createQuestion(question: QuestionResponse, data: TQuestionForm) {
	if (!data.config) {
		throw new Error("Config is required");
	}

	const requestBody: QuestionCreateRequestBody = {
		description: data.description,
		config: data.config,
	};

	return api.questionQuizIdQuestionsPost(question.quizId, requestBody);
}
