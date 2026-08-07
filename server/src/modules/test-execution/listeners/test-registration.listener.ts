import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import { DB_EVENTS, type IPostgresListenService } from '@shared/persistence';
import { TEST_REGISTRATION_WS_EVENTS, type IWebSocketService, type TestRegistrationWsEvent } from '@shared/websocket';
import type { ILogger } from '@shared/logger';

type TestRegistrationChangeData = {
	id: string;
	test_session_id: string;
	test_id: string;
	first_name: string;
	last_name: string;
	created_at: string;
};

type TestRegistrationChangePayload = {
	table: string;
	operation: string;
	time: string;
	data: TestRegistrationChangeData;
};

type TestRegistrationWsData = Omit<TestRegistrationChangeData, 'test_session_id' | 'created_at'> & {
	started_from: string;
};

@injectable()
export class TestRegistrationListener {
	constructor(
		@inject(APP_TYPES.POSTGRES_LISTEN) private readonly postgresListen: IPostgresListenService,
		@inject(APP_TYPES.WEBSOCKET) private readonly webSocketService: IWebSocketService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {
		this.postgresListen.on(DB_EVENTS.TEST_REGISTRATION_CHANGES, this.handle.bind(this));
	}

	private handle(raw: unknown): void {
		const payload = this.parsePayload(raw);

		if (!payload) {
			return;
		}

		const testId = payload.data.test_id;

		if (!testId) {
			this.logger.warn('[TestRegistrationListener] notification missing test_id');
			return;
		}

		const type = this.resolveEventType(payload);

		if (!type) {
			this.logger.warn({
				message: '[TestRegistrationListener] unsupported registration change',
				operation: payload.operation,
			});
			return;
		}

		const sendData: TestRegistrationWsData = {
			id: payload.data.id,
			test_id: payload.data.test_id,
			first_name: payload.data.first_name,
			last_name: payload.data.last_name,
			started_from: payload.data.created_at + 'Z',
		};

		this.webSocketService.send(testId, 'teacher', {
			type,
			data: sendData,
		});
	}

	private resolveEventType(payload: TestRegistrationChangePayload): TestRegistrationWsEvent | null {
		if (payload.operation === 'INSERT') {
			return TEST_REGISTRATION_WS_EVENTS.CREATED;
		}

		if (payload.operation === 'UPDATE') {
			return TEST_REGISTRATION_WS_EVENTS.UPDATED;
		}

		return null;
	}

	private parsePayload(raw: unknown): TestRegistrationChangePayload | null {
		if (typeof raw !== 'string' || raw.length === 0) {
			this.logger.warn('[TestRegistrationListener] empty or invalid notification payload');
			return null;
		}

		try {
			return JSON.parse(raw) as TestRegistrationChangePayload;
		} catch {
			this.logger.warn('[TestRegistrationListener] failed to parse notification payload');
			return null;
		}
	}
}
