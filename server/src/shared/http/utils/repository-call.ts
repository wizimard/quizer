import type { ILogger } from '@shared/logger';

export async function repositoryCall<T>(fn: () => Promise<T>, context: string, logger?: ILogger): Promise<T> {
	try {
		return await fn();
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);

		logger?.error(`[${context}] ${message}`);

		throw error;
	}
}
