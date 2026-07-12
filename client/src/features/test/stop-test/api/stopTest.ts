import type { Test } from "@entities/test";
import { testApi } from "@shared/api";
import { TestResponseStatusEnum } from "@shared/api/generated";

export function stopTest(test: Test) {
	if (test.status === TestResponseStatusEnum.Closed) {
		throw new Error("Test is not open");
	}

	return testApi.testTestIdFinishPost(test.id);
}
