import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import { DB_EVENTS, type IPostgresListenService } from '@shared/persistence';
import { TEST_SESSION_WS_EVENTS, type IWebSocketService, type TestSessionWsEvent } from '@shared/websocket';
import type { ILogger } from '@shared/logger';
import { QuestionExecuteMapper } from '@modules/test-execution/mappers/question-execute.mapper';
import type { QuestionExecuteResponse } from '@modules/test-execution/dto/response/question-execute-response.dto';
import { QM_TYPES } from '@modules/question-management/question-management.types';
import type { QuestionRepository } from '@modules/question-management/interfaces/repository/question.repository.interface';

type TestSessionChangeData = {
	id: string;
	test_id: string;
	current_question_id: string | null;
	finished_at: string | null;
};

type TestSessionChangePayload = {
	table: string;
	operation: string;
	time: string;
	data: TestSessionChangeData;
};

type TestSessionWsData = {
	id: string;
	test_id: string;
	current_question: QuestionExecuteResponse | null;
	current_question_index: number | null;
	total_questions_count: number;
	finished_at: string | null;
};

@injectable()
export class TestSessionListener {
	constructor(
		@inject(APP_TYPES.POSTGRES_LISTEN) private readonly postgresListen: IPostgresListenService,
		@inject(APP_TYPES.WEBSOCKET) private readonly webSocketService: IWebSocketService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
		@inject(QM_TYPES.QUESTION_REPOSITORY) private readonly questionRepository: QuestionRepository,
	) {
		this.postgresListen.on(DB_EVENTS.TEST_SESSION_CHANGES, this.handle.bind(this));
	}

	private async handle(raw: unknown): Promise<void> {
		const payload = this.parsePayload(raw);

		if (!payload) {
			return;
		}

		const testId = payload.data.test_id;

		if (!testId) {
			this.logger.warn('[TestSessionListener] notification missing test_id');
			return;
		}

		const type = this.resolveEventType(payload);

		if (!type) {
			this.logger.warn({
				message: '[TestSessionListener] unsupported session change',
				operation: payload.operation,
			});
			return;
		}

		const { current_question, current_question_index, total_questions_count } = await this.resolveQuestionProgress(testId, payload.data.current_question_id);

		const data: TestSessionWsData = {
			id: payload.data.id,
			test_id: payload.data.test_id,
			current_question,
			current_question_index,
			total_questions_count,
			finished_at: payload.data.finished_at,
		};

		this.webSocketService.send(testId, 'participants', {
			type,
			data,
		});
	}

	private async resolveQuestionProgress(
		testId: string,
		questionId: string | null,
	): Promise<{
		current_question: QuestionExecuteResponse | null;
		current_question_index: number | null;
		total_questions_count: number;
	}> {
		const questions = await this.questionRepository.findByTestId(testId);
		questions.sort((a, b) => a.sortKey - b.sortKey);

		const total_questions_count = questions.length;

		if (!questionId) {
			return {
				current_question: null,
				current_question_index: null,
				total_questions_count,
			};
		}

		const current_question_index = questions.findIndex((question) => question.id === questionId);

		if (current_question_index === -1) {
			this.logger.warn({
				message: '[TestSessionListener] current question not found',
				questionId,
			});

			return {
				current_question: null,
				current_question_index: null,
				total_questions_count,
			};
		}

		return {
			current_question: QuestionExecuteMapper.toResponse(questions[current_question_index]!),
			current_question_index: current_question_index + 1,
			total_questions_count,
		};
	}

	private resolveEventType(payload: TestSessionChangePayload): TestSessionWsEvent | null {
		if (payload.operation === 'INSERT') {
			return TEST_SESSION_WS_EVENTS.STARTED;
		}

		if (payload.operation === 'UPDATE') {
			if (payload.data.finished_at) {
				return TEST_SESSION_WS_EVENTS.FINISHED;
			}

			if (payload.data.current_question_id) {
				return TEST_SESSION_WS_EVENTS.QUESTION_CHANGED;
			}
		}

		return null;
	}

	private parsePayload(raw: unknown): TestSessionChangePayload | null {
		if (typeof raw !== 'string' || raw.length === 0) {
			this.logger.warn('[TestSessionListener] empty or invalid notification payload');
			return null;
		}

		try {
			return JSON.parse(raw) as TestSessionChangePayload;
		} catch {
			this.logger.warn('[TestSessionListener] failed to parse notification payload');
			return null;
		}
	}
}
