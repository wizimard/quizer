import type { Request } from 'express';
import { RequestStorage } from '@shared/http/request.storage';
import type { TestEntity } from '../entities/test.entity';

export class TestStorage {
	private static readonly testByRequest = new WeakMap<Request, TestEntity>();

	static set(test: TestEntity): void {
		const req = RequestStorage.get();

		if (!req) {
			return;
		}

		this.testByRequest.set(req, test);
	}

	static get(): TestEntity | undefined {
		const req = RequestStorage.get();

		if (!req) {
			return undefined;
		}

		return this.testByRequest.get(req);
	}
}
