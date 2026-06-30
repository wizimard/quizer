import { plainToInstance, type ClassConstructor } from 'class-transformer';
import type { IMiddleware } from './middleware.interface';
import type { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import { HttpValidationError } from '@error';

export class ValidateMiddleware implements IMiddleware {
	constructor(private dtoClass: ClassConstructor<object>) {}

	async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
		const instance = plainToInstance(this.dtoClass, req.body);

		try {
			await validateOrReject(instance);
			req.body = instance;
			next();
		} catch (err: unknown) {
			next(new HttpValidationError('validation_failed', 'ValidateMiddleware', err as object));
		}
	}
}
