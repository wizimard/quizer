export const DB_EVENTS = {
	TEST_SESSION_CHANGES: 'test_session_changes',
	TEST_REGISTRATION_CHANGES: 'test_registration_changes',
	TEST_ANSWER_CHANGES: 'test_answer_changes',
} as const;

export type DbEvent = (typeof DB_EVENTS)[keyof typeof DB_EVENTS];
