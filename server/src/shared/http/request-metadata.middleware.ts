import type { IMiddleware } from '@shared/http/middleware.interface';
import { injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { RequestMetadataStorage } from './request-metadata.storage';

@injectable()
export class RequestMetadataMiddleware implements IMiddleware {
	execute(_req: Request, _res: Response, next: NextFunction): void {
		RequestMetadataStorage.run({ correlationId: randomUUID() }, () => next());
	}
}
