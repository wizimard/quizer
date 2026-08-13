import { createContext } from "react";

export type WebSocketContextValue = {
	lastMessage: MessageEvent | null;
	sendMessage: (data: Parameters<WebSocket["send"]>[0]) => void;
	readyState: number;
};

export const WebSocketContext = createContext<WebSocketContextValue | null>(null);
