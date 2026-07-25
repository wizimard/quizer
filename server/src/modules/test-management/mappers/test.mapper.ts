import type { TestSchedulerPeriodModel, TestModel, TestQuestionModel, TestSessionModel } from '@prisma/client';
import { TestSchedulerPeriod } from '../entities/test-scheduler-period';
import { TestEntity } from '../entities/test.entity';
import { TestSettings } from '../entities/test-settings';
import { TestSessionEntity } from '../entities/test-session.entity';
import type { TestModelAll } from '../interfaces/repository/test.repository.interface';
import { QuestionMapper } from './question.mapper';
import type { TestResponse } from '../dto/http/response/test.response-dto';
import type { TestFullResponse, TestFullResponseSettings } from '../dto/http/response/test-full.response-dto';
import { QuestionConfigMapper } from './question-config.mapper';
import type { QuestionResponse } from '../dto/http/response/question.response-dto';
import type { TestSchedulerResponsePeriod } from '../dto/http/response/test-scheduler.response-dto';
import type { TestFullResult, TestFullResultSettings } from '../interfaces/services/results/test-full.result';
import type { TestResult } from '../interfaces/services/results/test.result';
import type { QuestionResult } from '../interfaces/services/results/question.result';
import type { TestSchedulerResultPeriod } from '../interfaces/services/results/test-scheduler.result';
import { SchedulerPeriodMapper } from './scheduler-period.mapper';
import type { CreateTestInput } from '../interfaces/services/input/create-test.input';
import type { TestExecutionOverviewResult } from '../interfaces/services/results/test-overview-result';
import type { TestExecutionOverviewManualModeResponse, TestExecutionOverviewResponse } from '../dto/http/response/test-execution-overview-response.dto';
import { Helper } from '@shared/utils/helper';

export class TestMapper {
	static toDomain(testModel: TestModelAll | TestModel): TestEntity {
		const test: TestEntity = new TestEntity(testModel.id, testModel.author_id, testModel.title, testModel.updated_at, testModel.created_at);

		if ('questions' in testModel) {
			test.questions = testModel.questions.map((question: TestQuestionModel) => QuestionMapper.toDomain(question));
		}

		if ('scheduler_periods' in testModel) {
			test.schedulerPeriods = testModel.scheduler_periods.map(
				(period: TestSchedulerPeriodModel) => new TestSchedulerPeriod(Number(period.id), test.id, period.available_from, period.available_to),
			);
		}

		if ('test_settings' in testModel && testModel.test_settings) {
			test.settings = new TestSettings(test.id, testModel.test_settings.show_answers_after_completion);
		}

		if ('test_sessions' in testModel) {
			test.setSessions(
				testModel.test_sessions.map(
					(session: TestSessionModel) =>
						new TestSessionEntity(session.id, test.id, session.status, session.run_mode, session.started_at, session.finished_at, session.start_by, session.current_question_id),
				),
			);
		}

		return test;
	}

	static toResult(test: TestEntity): TestResult {
		return {
			id: test.id,
			authorId: test.authorId,
			title: test.title,
			status: test.status,
			createdAt: test.createdAt,
			updatedAt: test.updatedAt,
		};
	}

	static toFullResult(test: TestEntity): TestFullResult {
		const settings: TestFullResultSettings = {
			isShowAnswersAfterCompletion: test.settings?.isShowAnswersAfterCompletion ?? false,
		};

		return {
			...this.toResult(test),
			questions: test.questions.map(QuestionMapper.toResult),
			settings,
			scheduler: {
				periods: test.schedulerPeriods.map(SchedulerPeriodMapper.toResult),
			},
			session: test.sessions[0] ?? null,
		};
	}

	static toResponse(test: TestResult): TestResponse {
		return {
			id: test.id,
			author_id: test.authorId,
			title: test.title,
			isOpen: test.status === 'open' || test.status === 'open_by_scheduler',
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
			questions: test.questions.map(
				(question: QuestionResult): QuestionResponse => ({
					id: question.id,
					test_id: question.testId,
					sort_key: question.sortKey,
					description: question.description,
					config: QuestionConfigMapper.toHttp(question.config),
				}),
			),
			settings,
			scheduler: {
				periods: test.scheduler.periods.map(
					(period: TestSchedulerResultPeriod): TestSchedulerResponsePeriod => ({
						id: period.id,
						test_id: period.testId,
						available_from: period.availableFrom,
						available_to: period.availableTo,
					}),
				),
			},
			updated_at: test.updatedAt,
			created_at: test.createdAt,
		};
	}

	static buildTestFromCreateInput(input: CreateTestInput): TestEntity {
		return new TestEntity(Helper.generateId(), input.authorId, input.title, new Date(), new Date());
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
			(overviewResponse as TestExecutionOverviewManualModeResponse).current_question = testOverview.currentQuestion ? QuestionMapper.toResponse(testOverview.currentQuestion) : null;
			(overviewResponse as TestExecutionOverviewManualModeResponse).current_question_index = testOverview.currentQuestionIndex;
			(overviewResponse as TestExecutionOverviewManualModeResponse).total_questions_count = testOverview.totalQuestionsCount;
		}

		return overviewResponse;
	}
}
