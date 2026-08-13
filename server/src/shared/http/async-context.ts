import { UserStorage } from '@modules/identity-access';
import type { ITokenPayload } from '@modules/identity-access/interfaces/services/token.service.interface';
import type { Request } from 'express';
import type { RequestMetadata } from './request-metadata.storage';
import { RequestMetadataStorage } from './request-metadata.storage';
import { RequestStorage } from './request.storage';

type CapturedAsyncContext = {
	metadata?: RequestMetadata;
	request?: Request;
	user?: ITokenPayload;
};

export function captureAsyncContext(): CapturedAsyncContext {
	const context: CapturedAsyncContext = {};

	const metadata = RequestMetadataStorage.get();
	if (metadata) {
		context.metadata = metadata;
	}

	const request = RequestStorage.get();
	if (request) {
		context.request = request;
	}

	const user = UserStorage.get();
	if (user) {
		context.user = user;
	}

	return context;
}

export function runWithAsyncContext(context: CapturedAsyncContext, callback: () => void): void {
	const runCallback = (): void => {
		if (context.user) {
			UserStorage.run(context.user, callback);
			return;
		}

		callback();
	};

	const runWithRequest = (): void => {
		if (context.request) {
			RequestStorage.run(context.request, runCallback);
			return;
		}

		runCallback();
	};

	if (context.metadata) {
		RequestMetadataStorage.run(context.metadata, runWithRequest);
		return;
	}

	runWithRequest();
}
