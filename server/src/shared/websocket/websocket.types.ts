export const WEBSOCKET_GROUPS = ['participants', 'teacher'] as const;

export type WebSocketGroup = (typeof WEBSOCKET_GROUPS)[number];

export function isWebSocketGroup(value: string): value is WebSocketGroup {
	return (WEBSOCKET_GROUPS as readonly string[]).includes(value);
}

export type WebSocketConnectionParams = {
	testId: string;
	group: WebSocketGroup;
};
