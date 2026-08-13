export const WEBSOCKET_GROUPS = {
	PARTICIPANTS: 'participants',
	TEACHER: 'teacher',
} as const;

export type WebSocketGroup = (typeof WEBSOCKET_GROUPS)[keyof typeof WEBSOCKET_GROUPS];

export function isWebSocketGroup(value: string): value is WebSocketGroup {
	return (Object.values(WEBSOCKET_GROUPS) as readonly string[]).includes(value);
}

export type WebSocketConnectionParams = {
	testId: string;
	group: WebSocketGroup;
};
