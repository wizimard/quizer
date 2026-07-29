import { inject, injectable } from 'inversify';
import type { IncomingMessage, Server } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';
import { APP_TYPES } from '@app/app.types';
import type { ILogger } from '@shared/logger';
import type { IWebSocketService } from './websocket.service.interface';
import { isWebSocketGroup, type WebSocketConnectionParams, type WebSocketGroup } from './websocket.types';

const WEBSOCKET_PATH = '/ws';

@injectable()
export class WebSocketService implements IWebSocketService {
	private wss: WebSocketServer | undefined;
	private readonly sockets = new Map<string, Set<WebSocket>>();

	constructor(@inject(APP_TYPES.LOGGER) private readonly logger: ILogger) {}

	public start(server: Server): void {
		if (this.wss) {
			this.logger.warn('[WebSocketService] already started');
			return;
		}

		this.wss = new WebSocketServer({ server, path: WEBSOCKET_PATH });

		this.wss.on('connection', (socket: WebSocket, request: IncomingMessage) => {
			const params = this.resolveConnectionParams(request);

			if (!params) {
				this.logger.warn('[WebSocketService] connection rejected: invalid testId or group');
				socket.close(1008, 'Invalid testId or group');
				return;
			}

			const roomKey = this.getRoomKey(params.testId, params.group);
			this.addSocket(roomKey, socket);
			this.logger.info(`[WebSocketService] client connected to test "${params.testId}" group "${params.group}"`);

			socket.on('close', () => {
				this.removeSocket(roomKey, socket);
				this.logger.info(`[WebSocketService] client disconnected from test "${params.testId}" group "${params.group}"`);
			});
		});

		this.logger.success(`[WebSocketService] started on path ${WEBSOCKET_PATH}`);
	}

	public send(testId: string, group: WebSocketGroup, data: unknown): void {
		if (!this.wss) {
			this.logger.warn('[WebSocketService] cannot send: server is not started');
			return;
		}

		const clients = this.sockets.get(this.getRoomKey(testId, group));

		if (!clients || clients.size === 0) {
			return;
		}

		const payload = typeof data === 'string' ? data : JSON.stringify(data);

		for (const client of clients) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(payload);
			}
		}
	}

	public async stop(): Promise<void> {
		if (!this.wss) {
			return;
		}

		const wss = this.wss;
		this.wss = undefined;

		for (const clients of this.sockets.values()) {
			for (const client of clients) {
				client.close();
			}
		}

		this.sockets.clear();

		await new Promise<void>((resolve, reject) => {
			wss.close((error?: Error) => {
				if (error) {
					reject(error);
					return;
				}

				resolve();
			});
		});

		this.logger.success('[WebSocketService] stopped');
	}

	private resolveConnectionParams(request: IncomingMessage): WebSocketConnectionParams | undefined {
		const host = request.headers.host ?? 'localhost';
		const url = new URL(request.url ?? '', `http://${host}`);
		const testId = url.searchParams.get('testId');
		const group = url.searchParams.get('group');

		if (!testId || !group || !isWebSocketGroup(group)) {
			return undefined;
		}

		return { testId, group };
	}

	private getRoomKey(testId: string, group: WebSocketGroup): string {
		return `${testId}:${group}`;
	}

	private addSocket(roomKey: string, socket: WebSocket): void {
		let clients = this.sockets.get(roomKey);

		if (!clients) {
			clients = new Set();
			this.sockets.set(roomKey, clients);
		}

		clients.add(socket);
	}

	private removeSocket(roomKey: string, socket: WebSocket): void {
		const clients = this.sockets.get(roomKey);

		if (!clients) {
			return;
		}

		clients.delete(socket);

		if (clients.size === 0) {
			this.sockets.delete(roomKey);
		}
	}
}
