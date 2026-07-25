import type { AxiosResponse } from "axios";
import { testApi } from "@shared/api";
import type { MessageResponse, TestStartRequestBody } from "@shared/api/generated";
import { toStartTestRequest, type StartTestForm } from "../model/startTestForm";

export function startTest(testId: string, data: StartTestForm): Promise<AxiosResponse<MessageResponse>> {
	const { runMode, duration } = toStartTestRequest(data);

	const requestBody: TestStartRequestBody = {
		run_mode: runMode,
	};

	if (duration) {
		requestBody.duration = duration;
	}

	return testApi.testTestIdStartPost(testId, requestBody);
}
