import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { USER_TYPES } from './user.types';
import { UserRepository } from '@infrastructure/persistence/prisma/user.repository';
import type { IUserRepository } from '@infrastructure/persistence/prisma/user.repository.interface';
import { User } from '@domain/user/user.entity';
import type { IUser } from '@domain/user/user.entity.interface';
import { UserController } from '@interfaces/http/user/user.controller';

const userContainer: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<IUserRepository>(USER_TYPES.USER_REPOSITORY).to(UserRepository).inSingletonScope();
	options.bind(USER_TYPES.USER_CONTROLLER).to(UserController).inSingletonScope();
});

export { userContainer, USER_TYPES, type IUserRepository, User, type IUser };
