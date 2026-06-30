/**
 * Bounded contexts (DDD Step 1)
 *
 * - Identity & Access: application/auth, infrastructure/auth, interfaces/http/auth
 * - Quiz Authoring: domain/quiz, application/quiz, interfaces/http/quiz
 * - Quiz Execution: application/quiz/execution, interfaces/http/quiz (execute controller)
 * - User Profile: domain/user, interfaces/http/user
 * - Shared Kernel: error, logger, config, interfaces/http/common
 */

export { quizContainer, QUIZ_TYPES } from './quiz.module';
export { authModule, AUTH_TYPES } from './auth.module';
export { userContainer, USER_TYPES } from './user.module';
