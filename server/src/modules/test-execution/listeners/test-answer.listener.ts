import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import { DB_EVENTS, type IPostgresListenService } from '@shared/persistence';
import { TEST_ANSWER_WS_EVENTS, type IWebSocketService, type TestAnswerWsEvent } from '@shared/websocket';
import type { ILogger } from '@shared/logger';
import { TM_TYPES } from '@modules/test-management/test-management.types';
import type { QuestionRepository } from '@modules/test-management/interfaces/repository/question.repository.interface';

type TestAnswerChangeData = {
	id: string;
	question_id: string;
	test_session_registered_user_id: string;
	test_id: string;
	value: string | null;
	skipped: boolean;
	created_at: string;
};

type TestAnswerChangePayload = {
	table: string;
	operation: string;
	time: string;
	data: TestAnswerChangeData;
};

type TestAnswerWsData = {
	question_id: string;
	user_id: string;
	value: string | null;
	skipped: boolean;
	is_correct: boolean | null;
};

@injectable()
export class TestAnswerListener {
	constructor(
		@inject(APP_TYPES.POSTGRES_LISTEN) private readonly postgresListen: IPostgresListenService,
		@inject(APP_TYPES.WEBSOCKET) private readonly webSocketService: IWebSocketService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
		@inject(TM_TYPES.QUESTION_REPOSITORY) private readonly questionRepository: QuestionRepository,
	) {
		this.postgresListen.on(DB_EVENTS.TEST_ANSWER_CHANGES, this.handle.bind(this));
	}

	private async handle(raw: unknown): Promise<void> {
		const payload = this.parsePayload(raw);

		if (!payload) {
			return;
		}

		const testId = payload.data.test_id;

		if (!testId) {
			this.logger.warn('[TestAnswerListener] notification missing test_id');
			return;
		}

		const type = this.resolveEventType(payload);

		if (!type) {
			this.logger.warn({
				message: '[TestAnswerListener] unsupported answer change',
				operation: payload.operation,
			});
			return;
		}

		const data: TestAnswerWsData = {
			question_id: payload.data.question_id,
			user_id: payload.data.test_session_registered_user_id,
			value: payload.data.value,
			skipped: payload.data.skipped,
			is_correct: await this.resolveIsCorrect(payload.data),
		};

		this.webSocketService.send(testId, 'teacher', {
			type,
			data,
		});
	}

	private async resolveIsCorrect(answer: TestAnswerChangeData): Promise<boolean | null> {
		if (answer.skipped) {
			return false;
		}

		if (answer.value === null) {
			return null;
		}

		const question = await this.questionRepository.findById(answer.question_id);

		if (!question) {
			this.logger.warn({
				message: '[TestAnswerListener] question not found for answer',
				questionId: answer.question_id,
			});
			return null;
		}

		return question.isCorrectAnswer(answer.value);
	}

	private resolveEventType(payload: TestAnswerChangePayload): TestAnswerWsEvent | null {
		if (payload.operation === 'INSERT') {
			return TEST_ANSWER_WS_EVENTS.CREATED;
		}

		if (payload.operation === 'UPDATE') {
			return TEST_ANSWER_WS_EVENTS.UPDATED;
		}

		return null;
	}

	private parsePayload(raw: unknown): TestAnswerChangePayload | null {
		if (typeof raw !== 'string' || raw.length === 0) {
			this.logger.warn('[TestAnswerListener] empty or invalid notification payload');
			return null;
		}

		try {
			return JSON.parse(raw) as TestAnswerChangePayload;
		} catch {
			this.logger.warn('[TestAnswerListener] failed to parse notification payload');
			return null;
		}
	}
}
