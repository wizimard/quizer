import { AsyncLocalStorage } from 'node:async_hooks';
import type { TestEntity } from '../entities/test.entity';

export class TestStorage {
	private static readonly storage = new AsyncLocalStorage<TestEntity>();

	static run(test: TestEntity, callback: () => void): void {
		this.storage.run(test, callback);
	}

	static get(): TestEntity | undefined {
		return this.storage.getStore();
	}
}
