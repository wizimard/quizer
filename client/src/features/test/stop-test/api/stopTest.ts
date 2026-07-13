import type { Test } from "@entities/test";
import { testApi } from "@shared/api";

export function stopTest(test: Test) {
	if (!test.isOpen) {
		throw new Error("Test is not open");
	}

	return testApi.testTestIdFinishPost(test.id);
}
