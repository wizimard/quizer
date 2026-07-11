import type { TestFull } from "../model/test-full.interface";
import type { Test } from "../model/test.interface";
import { normalizeScheduler } from "./normalizeScheduler";
import type { TestFullResponse, TestResponse } from "@shared/api/generated";
import { normalizeQuestion } from "@entities/question";

export function normalizeTest(test: TestResponse): Test {
	return {
		...test,
		authorId: test.author_id,
		updatedAt: new Date(test.updated_at),
		createdAt: new Date(test.created_at),
	};
}

export function normalizeTestFull(test: TestFullResponse): TestFull {
	test.questions.sort((a, b) => a.sort_key - b.sort_key);

	const schedulerPeriods = normalizeScheduler(test.scheduler);

	schedulerPeriods.sort((a, b) => a.availableFrom.getTime() - b.availableFrom.getTime());

	return {
		...test,
		questions: test.questions.map(normalizeQuestion),
		authorId: test.author_id,
		schedulerPeriods,
		updatedAt: new Date(test.updated_at),
		createdAt: new Date(test.created_at),
		settings: {
			...test.settings,
			isRequiredEmail: test.settings.is_required_email,
			isRequiredFirstName: test.settings.is_required_first_name,
			isRequiredLastName: test.settings.is_required_last_name,
			isShowAnswersAfterCompletion: test.settings.is_show_answers_after_completion,
		},
	};
}
