import type { TQuestionForm } from "../model/question-form";
import type { QuestionUpdateRequestBody } from "@shared/api/generated";
import { questionApi } from "@shared/api";
import type { Question } from "@entities/question";

export function updateQuestion(question: Question, data: TQuestionForm) {
	if (!data.config) {
		throw new Error("Config is required");
	}

	const requestBody: QuestionUpdateRequestBody = {
		description: data.description,
		config: data.config,
	};

	return questionApi.questionTestIdQuestionsQuestionIdPatch(question.testId, question.id, requestBody);
}
