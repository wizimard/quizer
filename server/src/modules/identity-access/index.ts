export { identityAccessModule, IA_TYPES } from './identity-access.module';
export type { ITokenPayload } from './interfaces/services/token.service.interface';
export { InvalidCredentialsError } from './utils/errors/invalid-credentials.error';
export { EmailAlreadyTakenError } from './utils/errors/email-already-taken.error';
export { UserStorage } from './storage/user.storage';

// TODO: move user to user module
