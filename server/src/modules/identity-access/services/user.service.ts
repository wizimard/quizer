import { injectable, inject } from 'inversify';
import { IA_TYPES } from '..';
import type { User } from '../entities/user.entity';
import type { UserRepository } from '../interfaces/user.repository.interface';
import { HttpError } from '@shared/error/http.error';
import type { IUserService } from '../interfaces/services/user.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(IA_TYPES.USER_REPOSITORY) private readonly userRepository: UserRepository) {}

	async getUserById(id: string): Promise<User> {
		const user: User | null = await this.userRepository.findById(id);

		if (!user) {
			throw new HttpError(404, 'User not found');
		}

		return user;
	}

	async deleteUser(id: string): Promise<void> {
		if (!(await this.userRepository.delete(id))) {
			throw new HttpError(404, 'User not found');
		}

		return;
	}
}
