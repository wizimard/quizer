import type { DbEvent } from './db_events.constant';

export interface IPostgresListenService {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	on(event: DbEvent, listener: (data: unknown) => void): void;
	off(event: DbEvent, listener: (data: unknown) => void): void;
}
