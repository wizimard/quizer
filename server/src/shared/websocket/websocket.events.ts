export const TEST_SESSION_WS_EVENTS = {
	STARTED: 'test_session_started',
	QUESTION_CHANGED: 'test_session_question_changed',
	FINISHED: 'test_session_finished',
} as const;

export type TestSessionWsEvent = (typeof TEST_SESSION_WS_EVENTS)[keyof typeof TEST_SESSION_WS_EVENTS];

export const TEST_ANSWER_WS_EVENTS = {
	CREATED: 'test_answer_created',
	UPDATED: 'test_answer_updated',
} as const;

export type TestAnswerWsEvent = (typeof TEST_ANSWER_WS_EVENTS)[keyof typeof TEST_ANSWER_WS_EVENTS];

export const TEST_REGISTRATION_WS_EVENTS = {
	CREATED: 'test_registration_created',
	UPDATED: 'test_registration_updated',
} as const;

export type TestRegistrationWsEvent =
	(typeof TEST_REGISTRATION_WS_EVENTS)[keyof typeof TEST_REGISTRATION_WS_EVENTS];
