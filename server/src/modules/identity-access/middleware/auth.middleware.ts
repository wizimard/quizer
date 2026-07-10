import type { IMiddleware } from '@shared/http/middleware.interface';
import type { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { IA_TYPES } from '../identity-access.types';
import type { ITokenPayload, ITokenService } from '../interfaces/services/token.service.interface';

@injectable()
export class AuthMiddleware implements IMiddleware {
	constructor(@inject(IA_TYPES.TOKEN_SERVICE) private readonly tokenService: ITokenService) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		let token: string | undefined = req.header('Authorization');

		if (!token || !token.startsWith('Bearer')) {
			return next();
		}

		token = token.substring(7);

		const user: ITokenPayload | null = this.tokenService.verifyAccessToken(token);

		if (user) {
			req.user = user;
		}

		next();
	}
}
