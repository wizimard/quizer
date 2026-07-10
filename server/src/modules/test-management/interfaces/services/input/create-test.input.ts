import type { UserId } from '@modules/identity-access';

export interface CreateTestInput {
	title: string;
	authorId: UserId;
}
