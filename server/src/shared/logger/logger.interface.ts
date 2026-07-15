export type LogMessage = {
	message: string;
};

export interface ILogger {
	setCorrelationId(correlationId: string): void;
	info<T extends LogMessage>(data: string | T): void;
	error<T extends LogMessage>(data: string | T): void;
	warn<T extends LogMessage>(data: string | T): void;
	success<T extends LogMessage>(data: string | T): void;
}
