import type { User } from '../entities/user.entity';
import type { Email } from '../entities/email';

export interface UserRepository {
	create(user: User): Promise<User | null>;
	findByEmail(email: Email): Promise<User | null>;
	findById(id: string): Promise<User | null>;
	existsByEmail(email: Email): Promise<boolean>;
	delete(id: string): Promise<boolean>;
}
