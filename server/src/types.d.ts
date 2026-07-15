import type { ITokenPayload } from '@modules/identity-access';
import type { QuestionEntity, TestEntity } from '@modules/test-management';

declare global {
	namespace Express {
		interface Request {
			user?: ITokenPayload;
			test?: TestEntity;
			question?: QuestionEntity;
			correlationId?: string;
		}
	}
}
