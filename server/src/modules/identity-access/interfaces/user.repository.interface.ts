import type { User } from '../entities/user.entity';
import type { Email } from '../entities/email';
import type { UserId } from '../entities/user-id';

export interface UserRepository {
	create(user: User): Promise<User>;
	findByEmail(email: Email): Promise<User | null>;
	findById(id: UserId): Promise<User | null>;
	existsByEmail(email: Email): Promise<boolean>;
	delete(id: UserId): Promise<boolean>;
}
