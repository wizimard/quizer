import type { TestSessionRunMode } from '@prisma/client';

export interface TestLaunchResponse {
	test_id: string;
	test_title: string;
	session_id: string;
	run_mode: TestSessionRunMode;
	user_registered_count: number;
	started_at: Date;
	finished_at: Date;
}
