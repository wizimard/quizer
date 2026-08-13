import { APP_TYPES } from '@app/app.types';
import type { IConfigService } from '@shared/config';
import { inject, injectable } from 'inversify';
import { Client as PgClient } from 'pg';
import { DB_EVENTS, type DbEvent } from './db_events.constant';
import type { ILogger } from '@shared/logger';
import type { IPostgresListenService } from './postgres-listen.service.interface';

@injectable()
export class PostgresListenService implements IPostgresListenService {
	private pgClient: PgClient;

	private listeners = new Map<DbEvent, ((data: unknown) => void)[]>();

	constructor(
		@inject(APP_TYPES.CONFIG) private readonly configService: IConfigService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {
		this.pgClient = new PgClient({
			connectionString: configService.get<string>('DATABASE_URL'),
		});
	}

	async connect(): Promise<void> {
		await this.pgClient.connect();

		this.logger.info('Connected to PostgreSQL');

		for (const event of Object.values(DB_EVENTS)) {
			await this.pgClient.query(`LISTEN ${event}`);
			this.logger.info(`Listening for events: ${event}`);
		}

		this.pgClient.on('notification', (msg) => {
			this.logger.info(`Received notification: ${msg.channel}`);

			const event = msg.channel as DbEvent;

			this.logger.info(`Event: ${event}`);

			const listeners = this.listeners.get(event);

			if (listeners) {
				for (const listener of listeners) {
					listener(msg.payload);
				}
			}
		});
	}

	async disconnect(): Promise<void> {
		await this.pgClient.end();
	}

	on(event: DbEvent, listener: (data: unknown) => void): void {
		let listeners = this.listeners.get(event);

		if (!listeners) {
			listeners = [];
		}

		listeners.push(listener);

		this.listeners.set(event, listeners);
	}

	off(event: DbEvent, listener: (data: unknown) => void): void {
		const listeners = this.listeners.get(event);

		if (!listeners) {
			return;
		}

		this.listeners.set(
			event,
			listeners.filter((l) => l !== listener),
		);
	}
}
