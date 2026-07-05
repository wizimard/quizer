import type { ITokenPayload } from '@modules/identity-access';
import type { QuizEntity } from '@modules/quiz-management';

declare global {
	namespace Express {
		interface Request {
			user?: ITokenPayload;
			quiz?: QuizEntity;
			correlationId?: string;
		}
	}
}
