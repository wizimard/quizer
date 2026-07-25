import { testApi } from "@shared/api";
import type { TestExecutionOverviewResponse } from "@shared/api/generated";
import type { AxiosResponse } from "axios";

export function nextQuestion(testId: string, questionId: string): Promise<AxiosResponse<TestExecutionOverviewResponse>> {
	return testApi.testTestIdNextQuestionPost(testId, { question_id: questionId });
}
