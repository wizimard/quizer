export interface TestResponse {
	id: string;
	author_id: string;
	isOpen: boolean;
	title: string;
	launches_count: number;
	last_launch_date: Date | null;
	updated_at: Date;
	created_at: Date;
}
