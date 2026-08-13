import { useEffect, useRef, useState, type ReactNode } from "react";

import { WebSocketContext } from "./context";

type HeartbeatOptions = {
	interval: number;
	message: string;
};

type WebSocketProviderProps = {
	url: string;
	queryParams?: Record<string, string>;
	shouldReconnect?: boolean | (() => boolean);
	reconnectInterval?: number;
	heartbeat?: HeartbeatOptions;
	children: ReactNode;
};

const buildWsUrl = (url: string, queryParams?: Record<string, string>) => {
	if (!queryParams || Object.keys(queryParams).length === 0) {
		return url;
	}

	const search = new URLSearchParams(queryParams).toString();

	return `${url}${url.includes("?") ? "&" : "?"}${search}`;
};

const isValidWsUrl = (url: string | undefined): url is string => Boolean(url);

export const WebSocketProvider = ({ url, queryParams, shouldReconnect = true, reconnectInterval = 3000, heartbeat, children }: WebSocketProviderProps) => {
	const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
	const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED);

	const wsRef = useRef<WebSocket | null>(null);
	const reconnectTimeoutRef = useRef<number | null>(null);
	const heartbeatIntervalRef = useRef<number | null>(null);
	const isUnmountedRef = useRef(false);

	const shouldReconnectRef = useRef(shouldReconnect);
	const reconnectIntervalRef = useRef(reconnectInterval);
	const heartbeatRef = useRef(heartbeat);

	useEffect(() => {
		shouldReconnectRef.current = shouldReconnect;
		reconnectIntervalRef.current = reconnectInterval;
		heartbeatRef.current = heartbeat;
	}, [shouldReconnect, reconnectInterval, heartbeat]);

	const queryParamsKey = queryParams ? JSON.stringify(queryParams) : "";
	const isUrlValid = isValidWsUrl(url);
	const resolvedReadyState = isUrlValid ? readyState : WebSocket.CLOSED;

	const clearReconnectTimeout = () => {
		if (reconnectTimeoutRef.current !== null) {
			window.clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}
	};

	const clearHeartbeat = () => {
		if (heartbeatIntervalRef.current !== null) {
			window.clearInterval(heartbeatIntervalRef.current);
			heartbeatIntervalRef.current = null;
		}
	};

	const sendMessage = (data: Parameters<WebSocket["send"]>[0]) => {
		if (wsRef.current?.readyState === WebSocket.OPEN) {
			wsRef.current.send(data);
		}
	};

	useEffect(() => {
		isUnmountedRef.current = false;

		if (!isUrlValid) {
			console.error("[WebSocketProvider] url is required");
			return;
		}

		const resolveShouldReconnect = () => {
			const value = shouldReconnectRef.current;

			if (typeof value === "function") {
				return value();
			}

			return value;
		};

		const startHeartbeat = (socket: WebSocket) => {
			clearHeartbeat();

			const currentHeartbeat = heartbeatRef.current;

			if (!currentHeartbeat) {
				return;
			}

			heartbeatIntervalRef.current = window.setInterval(() => {
				if (socket.readyState === WebSocket.OPEN) {
					socket.send(currentHeartbeat.message);
				}
			}, currentHeartbeat.interval);
		};

		const connect = () => {
			if (isUnmountedRef.current) {
				return;
			}

			clearReconnectTimeout();
			clearHeartbeat();

			if (wsRef.current) {
				wsRef.current.onopen = null;
				wsRef.current.onmessage = null;
				wsRef.current.onerror = null;
				wsRef.current.onclose = null;
				wsRef.current.close();
				wsRef.current = null;
			}

			const parsedQueryParams = queryParamsKey ? (JSON.parse(queryParamsKey) as Record<string, string>) : undefined;
			const socket = new WebSocket(buildWsUrl(url, parsedQueryParams));
			wsRef.current = socket;
			setReadyState(WebSocket.CONNECTING);

			socket.onopen = () => {
				if (isUnmountedRef.current) {
					socket.close();
					return;
				}

				setReadyState(WebSocket.OPEN);
				startHeartbeat(socket);
			};

			socket.onmessage = (event) => {
				if (isUnmountedRef.current) {
					return;
				}

				try {
					const data = JSON.parse(event.data);
					setLastMessage(data);
				} catch (error) {
					console.error("[WebSocketProvider] error parsing message", error);
					setLastMessage(null);
				}
			};

			socket.onerror = () => {
				if (isUnmountedRef.current) {
					return;
				}

				setReadyState(socket.readyState);
			};

			socket.onclose = () => {
				clearHeartbeat();

				if (isUnmountedRef.current) {
					return;
				}

				setReadyState(WebSocket.CLOSED);
				wsRef.current = null;

				if (resolveShouldReconnect()) {
					reconnectTimeoutRef.current = window.setTimeout(connect, reconnectIntervalRef.current);
				}
			};
		};

		connect();

		return () => {
			isUnmountedRef.current = true;
			clearReconnectTimeout();
			clearHeartbeat();

			if (wsRef.current) {
				wsRef.current.onopen = null;
				wsRef.current.onmessage = null;
				wsRef.current.onerror = null;
				wsRef.current.onclose = null;
				wsRef.current.close();
				wsRef.current = null;
			}
		};
	}, [url, isUrlValid, queryParamsKey]);

	return <WebSocketContext.Provider value={{ lastMessage, sendMessage, readyState: resolvedReadyState }}>{children}</WebSocketContext.Provider>;
};
