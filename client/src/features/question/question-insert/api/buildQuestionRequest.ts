import type { TQuestionForm } from "../model/question-form";
import type { QuestionCreateRequestBody, QuestionUpdateRequestBody } from "@shared/api/generated";

export function buildQuestionRequestBody(data: TQuestionForm): QuestionCreateRequestBody | QuestionUpdateRequestBody {
	return {
		description: data.description,
		config: data.config,
		score: data.score,
	};
}

export function buildQuestionFormData(data: TQuestionForm): FormData {
	const formData = new FormData();
	formData.append("description", data.description);
	formData.append("config", JSON.stringify(data.config));
	formData.append("score", String(data.score));
	formData.append("image", data.imageFile!);

	return formData;
}
