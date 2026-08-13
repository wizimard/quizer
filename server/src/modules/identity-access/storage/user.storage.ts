import { AsyncLocalStorage } from 'node:async_hooks';
import type { ITokenPayload } from '../interfaces/services/token.service.interface';

export class UserStorage {
	private static readonly storage = new AsyncLocalStorage<ITokenPayload>();

	static run(user: ITokenPayload, callback: () => void): void {
		this.storage.run(user, callback);
	}

	static get(): ITokenPayload | undefined {
		return this.storage.getStore();
	}
}
