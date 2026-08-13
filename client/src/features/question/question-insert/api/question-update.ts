import type { TQuestionForm } from "../model/question-form";
import type { QuestionResponse } from "@shared/api/generated";
import { apiClient } from "@shared/api";
import type { Question } from "@entities/question";
import { buildQuestionFormData, buildQuestionRequestBody } from "./buildQuestionRequest";

export function updateQuestion(question: Question, data: TQuestionForm) {
	if (!data.config) {
		throw new Error("Config is required");
	}

	if (data.imageFile) {
		return apiClient.patch<QuestionResponse>(`/question/${question.testId}/questions/${question.id}`, buildQuestionFormData(data));
	}

	return apiClient.patch<QuestionResponse>(`/question/${question.testId}/questions/${question.id}`, buildQuestionRequestBody(data));
}
