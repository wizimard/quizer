import { AsyncLocalStorage } from 'node:async_hooks';

export type RequestMetadata = {
	correlationId: string;
};

export class RequestMetadataStorage {
	private static readonly storage = new AsyncLocalStorage<RequestMetadata>();

	static run(metadata: RequestMetadata, callback: () => void): void {
		this.storage.run(metadata, callback);
	}

	static get(): RequestMetadata | undefined {
		return this.storage.getStore();
	}
}
