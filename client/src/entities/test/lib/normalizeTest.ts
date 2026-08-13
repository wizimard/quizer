import type { TestFull, TestSchedulerPeriod } from "../model/test-full.interface";
import type { Test } from "../model/test.interface";
import type { TestExecution } from "../model/test-execution.interface";
import type { TestExecutionOverview, TestExecutionOverviewRegisteredUser } from "../model/test-execution-overview.interface";

import type { TestSessionOverview } from "../model/test-session-overview.interface";
import type { TestLaunchHistory } from "../model/test-lauch-history.interface";
import { normalizeScheduler } from "./normalizeScheduler";
import {
	TestFullResponseStatusEnum,
	type TestFullResponse,
	type TestResponse,
	type TestExecuteResponse,
	TestExecuteResponseStatusEnum,
	type TestExecutionOverviewResponse,
	type TestSessionOverviewResponse,
	type TestLaunchResponse,
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
		last_launch_date: test.last_launch_date ? new Date(test.last_launch_date) : null,
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

export function normalizeTestLaunch(response: TestLaunchResponse): TestLaunchHistory {
	return {
		testId: response.test_id,
		testTitle: response.test_title,
		sessionId: response.session_id,
		userRegisteredCount: response.user_registered_count,
		runMode: response.run_mode,
		startedAt: new Date(response.started_at),
		finishedAt: new Date(response.finished_at),
	};
}

export function normalizeTestSessionOverview(response: TestSessionOverviewResponse): TestSessionOverview {
	const questions = response.questions.toSorted((a, b) => a.sort_key - b.sort_key);

	const registeredUsers: TestExecutionOverviewRegisteredUser[] = response.registered_users.map((user) => ({
		...user,
		started_from: new Date(user.started_from),
	}));

	return {
		id: response.id,
		title: response.title,
		run_mode: response.run_mode,
		max_score: response.max_score,
		questions,
		registered_users: registeredUsers,
		started_at: new Date(response.started_at),
		finished_at: new Date(response.finished_at),
	};
}
