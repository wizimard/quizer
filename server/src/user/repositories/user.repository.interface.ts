import type { UserModel } from '@prisma/client';
import type { IUser } from '../entities/user.entity.interface';

export interface IUserRepository {
	create(user: IUser): Promise<UserModel | null>;
	getByEmail(email: string): Promise<UserModel | null>;
	getById(id: string): Promise<UserModel | null>;
}
