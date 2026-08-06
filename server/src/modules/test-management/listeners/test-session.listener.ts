import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import { DB_EVENTS, type IPostgresListenService } from '@shared/persistence';
import { TEST_SESSION_WS_EVENTS, type IWebSocketService, type TestSessionWsEvent } from '@shared/websocket';
import type { ILogger } from '@shared/logger';

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

@injectable()
export class TestSessionListener {
	constructor(
		@inject(APP_TYPES.POSTGRES_LISTEN) private readonly postgresListen: IPostgresListenService,
		@inject(APP_TYPES.WEBSOCKET) private readonly webSocketService: IWebSocketService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {
		this.postgresListen.on(DB_EVENTS.TEST_SESSION_CHANGES, this.handle.bind(this));
	}

	private handle(raw: unknown): void {
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

		this.webSocketService.send(testId, 'participants', {
			type,
			data: payload.data,
		});
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
