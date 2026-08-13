import type { AxiosResponse } from "axios";
import { sessionApi } from "@shared/api";
import type { TestExecutionOverviewResponse } from "@shared/api/generated";

export function nextQuestion(testId: string, questionId: string): Promise<AxiosResponse<TestExecutionOverviewResponse>> {
	return sessionApi.sessionTestIdNextQuestionPost(testId, { question_id: questionId });
}
