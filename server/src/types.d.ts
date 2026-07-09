import type { ITokenPayload } from '@modules/identity-access';
import type { TestEntity } from '@modules/test-management';

declare global {
	namespace Express {
		interface Request {
			user?: ITokenPayload;
			test?: TestEntity;
			correlationId?: string;
		}
	}
}
