import { createContext } from "react";

export type WebSocketContextValue = {
	lastMessage: MessageEvent | null;
	sendMessage: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
	readyState: number;
};

export const WebSocketContext = createContext<WebSocketContextValue | null>(null);
