import type { IMiddleware } from '@common/middleware.interface';
import type { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { AUTH_TYPES } from '@composition/auth.types';
import type { ITokenPayload, ITokenService } from '@infrastructure/auth/jwt/token.service.interface';

@injectable()
export class AuthMiddleware implements IMiddleware {
	constructor(@inject(AUTH_TYPES.TOKEN_SERVICE) private readonly tokenService: ITokenService) {}

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
