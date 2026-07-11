import type { TQuestionForm } from "../model/question-form";
import type { QuestionCreateRequestBody } from "@shared/api/generated";
import { questionApi } from "@shared/api";
import type { Question } from "@entities/question";

export function createQuestion(question: Question, data: TQuestionForm) {
	if (!data.config) {
		throw new Error("Config is required");
	}

	const requestBody: QuestionCreateRequestBody = {
		description: data.description,
		config: data.config,
	};

	return questionApi.questionTestIdQuestionsPost(question.testId, requestBody);
}
