import type { Server } from 'node:http';
import type { WebSocketGroup } from './websocket.types';

export interface IWebSocketService {
	start(server: Server): void;
	stop(): Promise<void>;
	send(testId: string, group: WebSocketGroup, data: unknown): void;
}
