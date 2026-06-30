import type { Request } from 'express';
import { HttpError } from '@shared/error';

export function parseIdParam(req: Request, paramName = 'id', message = 'id_wrong_format'): string {
	const value = req.params[paramName];

	if (!value || typeof value !== 'string') {
		throw new HttpError(400, message);
	}

	return value;
}
