import type { User } from '@modules/identity-access/entities/user.entity';

export interface IUserService {
	getUserById(id: string): Promise<User>;
}
