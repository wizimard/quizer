import { injectable, inject } from 'inversify';
import { IA_TYPES, UserId } from '..';
import type { User } from '../entities/user.entity';
import type { UserRepository } from '../interfaces/user.repository.interface';
import { HttpError } from '@shared/error/http.error';

@injectable()
export class UserService {
	constructor(@inject(IA_TYPES.USER_REPOSITORY) private readonly userRepository: UserRepository) {}

	async getUserById(id: string): Promise<User> {
		const userId: UserId = UserId.of(id);

		const user: User | null = await this.userRepository.findById(userId);

		if (!user) {
			throw new HttpError(404, 'User not found');
		}
		return user;
	}
}
