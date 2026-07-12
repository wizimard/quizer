export interface ILogger {
	info(...messages: unknown[]): void;
	error(...messages: unknown[]): void;
	warn(...messages: unknown[]): void;
	success(...messages: unknown[]): void;
}
