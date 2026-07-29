// TODO: review
export { testManagementModule, TM_TYPES } from './test-management.module';

export { TestNotFoundError } from './utils/errors/test-not-found.error';
export { TestNotOwnedError } from './utils/errors/test-not-owned.error';
export { TestValidationFailedError } from './utils/errors/test-validation-failed.error';
export { UnknownQuestionTypeError } from './utils/errors/unknown-question-type.error';

export { TestEntity } from './entities/test.entity';
export type { TestStatus } from './entities/test.entity';
export { QuestionEntity } from './entities/question.entity';
export { createQuestionConfigFromPayload, isQuestionType, QUESTION_TYPES } from './entities/question-configs/question-config.registry';
export type { QuestionConfigBase } from './entities/question-configs/question-config.base';
export type { QuestionType } from './entities/question-configs/question-type';
export type { IQuestionSingleChoiseConfig } from './entities/question-configs/question-config-single-choise';
export type { IQuestionConfigMultipleChoise } from './entities/question-configs/question-config-multiple-choise';
export type { IQuestionInputValueConfig } from './entities/question-configs/question-config-input-value';
export type { IQuestionConfigOrderValuesAnswer, QuestionConfigOrderValues } from './entities/question-configs/question-config-order-values';
export type { TestSessionEntity } from './entities/test-session.entity';

export type { TestService } from './interfaces/services/test.service.interface';
export type { QuestionService } from './interfaces/services/question.service.interface';
export type { TestSessionService } from './interfaces/services/test-session.service.interface';
export type { TestSettingsService } from './interfaces/services/test-settings.service.interface';
export type { TestSchedulerService } from './interfaces/services/test-scheduler.service.interface';

