export const FULL_TEST_INCLUDE = {
	questions: {
		orderBy: { sort_key: 'asc' },
	},
	test_settings: true,
	scheduler_periods: true,
	test_sessions: {
		orderBy: { started_at: 'desc' },
	},
} as const;

export const SHORT_TEST_INCLUDE = {
	test_sessions: {
		orderBy: { started_at: 'desc' },
		take: 1,
	},
	test_settings: true,
} as const;
