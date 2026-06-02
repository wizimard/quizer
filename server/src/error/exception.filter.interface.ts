import type { Request, Response, NextFunction } from 'express';
import type { HttpError } from './http.error';

export interface IExceptionFilter {
	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void;
}
