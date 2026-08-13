import { sessionApi } from "@shared/api";

export type StoppableTest = {
	id: string;
	isOpen: boolean;
};

export function stopTest(test: StoppableTest) {
	if (!test.isOpen) {
		throw new Error("Test is not open");
	}

	return sessionApi.sessionTestIdFinishPost(test.id);
}
