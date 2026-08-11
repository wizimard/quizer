import type { TestResponse } from '../../dto/http/response/test.response-dto';
import type { TestFullResponse, TestFullResponseSettings } from '../../dto/http/response/test-full.response-dto';
import type { TestExecutionOverviewManualModeResponse, TestExecutionOverviewResponse } from '../../dto/http/response/test-execution-overview.response-dto';
import type { TestSessionOverviewResponse } from '../../dto/http/response/test-session-overview.response-dto';
import type { TestLaunchResponse } from '../../dto/http/response/test-launch.response-dto';
import type { TestResult } from '../../interfaces/services/results/test.result';
import type { TestFullResult } from '../../interfaces/services/results/test-full.result';
import type { TestExecutionOverviewResult, TestSessionOverviewResult } from '../../interfaces/services/results/test-overview-result';
import type { TestLaunchResult } from '../../interfaces/services/results/test-launch.result';
import { QuestionResponseMapper } from '@modules/question-management/mappers/response/question-response.mapper';
import { SchedulerResponseMapper } from './scheduler-response.mapper';

export class TestResponseMapper {
	static toResponse(test: TestResult): TestResponse {
		return {
			id: test.id,
			author_id: test.authorId,
			title: test.title,
			isOpen: test.status === 'open' || test.status === 'open_by_scheduler',
			launches_count: test.launchesCount,
			last_launch_date: test.lastLaunchDate,
			updated_at: test.updatedAt,
			created_at: test.createdAt,
		};
	}

	static toFullResponse(test: TestFullResult): TestFullResponse {
		const settings: TestFullResponseSettings = {
			is_show_answers_after_completion: test.settings?.isShowAnswersAfterCompletion ?? false,
		};

		return {
			id: test.id,
			author_id: test.authorId,
			title: test.title,
			status: test.status,
			launches_count: test.launchesCount,
			last_launch_date: test.lastLaunchDate,
			questions: test.questions.map(QuestionResponseMapper.toResponse),
			settings,
			scheduler: SchedulerResponseMapper.toResponse(test.scheduler.periods),
			updated_at: test.updatedAt,
			created_at: test.createdAt,
		};
	}

	static toTestExecutionOverviewResponse(testOverview: TestExecutionOverviewResult): TestExecutionOverviewResponse {
		const overviewResponse: TestExecutionOverviewResponse = {
			id: testOverview.test.id,
			title: testOverview.test.title,
			run_mode: testOverview.test.runMode,
			started_from: testOverview.test.startedFrom,
			registered_users: testOverview.users.map((user) => {
				return {
					id: user.id,
					first_name: user.firstName,
					last_name: user.lastName,
					started_from: user.startedFrom,
					answers: user.answers.map((answer) => {
						return {
							question_id: answer.questionId,
							is_correct: answer.isCorrect,
							skipped: answer.skipped,
						};
					}),
				};
			}),
			questions: testOverview.questions.map((question) => {
				return {
					id: question.id,
					sort_key: question.sortKey,
				};
			}),
		};

		if ('currentQuestion' in testOverview) {
			(overviewResponse as TestExecutionOverviewManualModeResponse).current_question = testOverview.currentQuestion ? QuestionResponseMapper.toResponse(testOverview.currentQuestion) : null;
			(overviewResponse as TestExecutionOverviewManualModeResponse).current_question_index = testOverview.currentQuestionIndex;
			(overviewResponse as TestExecutionOverviewManualModeResponse).total_questions_count = testOverview.totalQuestionsCount;
		}

		return overviewResponse;
	}

	static toTestLaunchResponse(testLaunch: TestLaunchResult): TestLaunchResponse {
		return {
			test_id: testLaunch.testId,
			test_title: testLaunch.testTitle,
			session_id: testLaunch.sessionId,
			run_mode: testLaunch.runMode,
			user_registered_count: testLaunch.userRegisteredCount,
			started_at: testLaunch.startedAt,
			finished_at: testLaunch.finishedAt,
		};
	}

	static toTestSessionOverviewResponse(testSessionOverview: TestSessionOverviewResult): TestSessionOverviewResponse {
		return {
			id: testSessionOverview.test.id,
			title: testSessionOverview.test.title,
			run_mode: testSessionOverview.test.runMode,
			questions: testSessionOverview.questions.map((question) => {
				return {
					id: question.id,
					sort_key: question.sortKey,
				};
			}),
			registered_users: testSessionOverview.users.map((user) => {
				return {
					id: user.id,
					first_name: user.firstName,
					last_name: user.lastName,
					started_from: user.startedFrom,
					answers: user.answers.map((answer) => {
						return {
							question_id: answer.questionId,
							is_correct: answer.isCorrect,
							skipped: answer.skipped,
						};
					}),
				};
			}),
			started_at: testSessionOverview.test.startedFrom,
			finished_at: testSessionOverview.test.finishedAt,
		};
	}
}
