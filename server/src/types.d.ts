import { ITokenPayload } from './auth';

declare global {
	namespace Express {
		interface Request {
			user?: ITokenPayload;
		}
	}
}
