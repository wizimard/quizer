import type { UserModel } from '@prisma/client';
import { User } from '../entities/user.entity';
import { Email } from '../entities/email';

export const UserMapper = {
	toDomain(model: UserModel): User {
		return User.reconstitute(model.id, Email.of(model.email), model.password);
	},

	toCreateData(user: User): { id: string; email: string; password: string } {
		return {
			id: user.id,
			email: user.email.value,
			password: user.passwordHash,
		};
	},

	toHttp(user: User) {
		return {
			id: user.id,
			email: user.email.value,
		};
	},
};
