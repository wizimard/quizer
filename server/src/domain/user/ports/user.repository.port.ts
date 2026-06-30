import type { IUser } from '../user.entity.interface';

export interface UserRepository {
	create(user: IUser): Promise<IUser | null>;
	getByEmail(email: string): Promise<IUser | null>;
	getById(id: string): Promise<IUser | null>;
}
