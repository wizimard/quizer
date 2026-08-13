export const WEBSOCKET_GROUPS = {
	PARTICIPANTS: "participants",
	TEACHER: "teacher",
} as const;

export type WebSocketGroup = (typeof WEBSOCKET_GROUPS)[keyof typeof WEBSOCKET_GROUPS];
