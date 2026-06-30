import type { UserModel } from '@prisma/client';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { UserId } from '../../../domain/value-objects/user-id.vo';

export const UserMapper = {
	toDomain(model: UserModel): User {
		return User.reconstitute(UserId.of(model.id), Email.of(model.email), model.password);
	},

	toCreateData(user: User): { id: string; email: string; password: string } {
		return {
			id: user.id.value,
			email: user.email.value,
			password: user.passwordHash,
		};
	},
};
