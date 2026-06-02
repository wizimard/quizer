import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { USER_TYPES } from './user.types';
import { UserRepository } from './repositories/user.repository';
import type { IUserRepository } from './repositories/user.repository.interface';
import { User } from './entities/user.entity';
import type { IUser } from './entities/user.entity.interface';
import { UserController } from './controllers/user.controller';

const userContainer: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind(USER_TYPES.USER_REPOSITORY).to(UserRepository).inSingletonScope();
	options.bind(USER_TYPES.USER_CONTROLLER).to(UserController).inSingletonScope();
});

export { userContainer, USER_TYPES, type IUserRepository, User, type IUser };
