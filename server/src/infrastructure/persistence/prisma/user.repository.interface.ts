import type { UserModel } from '@prisma/client';
import type { IUser } from '@domain/user/user.entity.interface';

export interface IUserRepository {
	create(user: IUser): Promise<UserModel | null>;
	getByEmail(email: string): Promise<UserModel | null>;
	getById(id: string): Promise<UserModel | null>;
}
