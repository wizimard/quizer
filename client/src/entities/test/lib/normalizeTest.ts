import type { TestFull, TestSchedulerPeriod } from "../model/test-full.interface";
import type { Test } from "../model/test.interface";
import type { TestExecution } from "../model/test-execution.interface";
import type { TestExecutionOverview, TestExecutionOverviewRegisteredUser } from "../model/test-execution-overview.interface";
import { normalizeScheduler } from "./normalizeScheduler";
import {
	TestFullResponseStatusEnum,
	type TestFullResponse,
	type TestResponse,
	type TestExecuteResponse,
	TestExecuteResponseStatusEnum,
	type TestExecutionOverviewResponse,
} from "@shared/api/generated";
import { normalizeQuestion, type Question } from "@entities/question";
import { normalizeExecutionQuestion } from "@entities/question/lib/normalizeQuestion";

export function normalizeTest(test: TestResponse): Test {
	return {
		...test,
		authorId: test.author_id,
		updatedAt: new Date(test.updated_at),
		createdAt: new Date(test.created_at),
	};
}

export function normalizeTestFull(test: TestFullResponse): TestFull {
	const questions: Array<Question> = test.questions.toSorted((a, b) => a.sort_key - b.sort_key).map(normalizeQuestion);

	const schedulerPeriods: Array<TestSchedulerPeriod> = normalizeScheduler(test.scheduler);

	schedulerPeriods.sort((a, b) => a.availableFrom.getTime() - b.availableFrom.getTime());

	return {
		...test,
		isOpen: test.status === TestFullResponseStatusEnum.Open || test.status === TestFullResponseStatusEnum.OpenByScheduler,
		questions: questions,
		authorId: test.author_id,
		schedulerPeriods,
		updatedAt: new Date(test.updated_at),
		createdAt: new Date(test.created_at),
		settings: {
			...test.settings,
			isShowAnswersAfterCompletion: test.settings.is_show_answers_after_completion,
		},
	};
}

export function normalizeExecutionTest(test: TestExecuteResponse): TestExecution {
	return {
		id: test.id,
		title: test.title,
		isOpen: test.status === TestExecuteResponseStatusEnum.Open,
		openDate: test.open_from_at,
		closeDate: test.open_until_at,
		questions: test.questions.map(normalizeExecutionQuestion),
		status: test.status,
	};
}

export function normalizeTestExecutionOverview(response: TestExecutionOverviewResponse): TestExecutionOverview {
	const questions = response.questions.toSorted((a, b) => a.sort_key - b.sort_key);

	const registeredUsers: TestExecutionOverviewRegisteredUser[] = response.registered_users.map((user) => ({
		...user,
		started_from: new Date(user.started_from),
	}));

	const normalizedOverviewTest: TestExecutionOverview = {
		id: response.id,
		title: response.title,
		run_mode: response.run_mode,
		questions,
		registered_users: registeredUsers,
		started_from: new Date(response.started_from),
		finished_at: response.finished_at ? new Date(response.finished_at) : null,
	};

	if (response.current_question !== undefined) {
		normalizedOverviewTest.current_question = response.current_question ? normalizeQuestion(response.current_question) : null;
		normalizedOverviewTest.current_question_index = response.current_question_index ?? null;
		normalizedOverviewTest.total_questions_count = response.total_questions_count;
	}

	return normalizedOverviewTest;
}
