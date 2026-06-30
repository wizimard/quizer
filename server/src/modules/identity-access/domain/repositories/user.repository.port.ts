import type { User } from '../entities/user.entity';
import type { Email } from '../value-objects/email.vo';
import type { UserId } from '../value-objects/user-id.vo';

export interface UserRepository {
	create(user: User): Promise<User>;
	findByEmail(email: Email): Promise<User | null>;
	findById(id: UserId): Promise<User | null>;
	existsByEmail(email: Email): Promise<boolean>;
}
