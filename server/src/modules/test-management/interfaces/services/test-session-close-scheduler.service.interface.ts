export interface TestSessionCloseScheduler {
	start(): Promise<void>;
	stop(): Promise<void>;
	schedule(testId: string, closeAt: Date): void;
	cancel(testId: string): void;
}
