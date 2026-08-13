import { AsyncLocalStorage } from 'node:async_hooks';
import type { Request } from 'express';

export class RequestStorage {
	private static readonly storage = new AsyncLocalStorage<Request>();

	static run(req: Request, callback: () => void): void {
		this.storage.run(req, callback);
	}

	static get(): Request | undefined {
		return this.storage.getStore();
	}
}
