import type { TestResponse } from "@shared/api/generated";

export interface Test extends Omit<TestResponse, "author_id" | "updated_at" | "created_at"> {
	isOpen: boolean;
	authorId: string;
	updatedAt: Date;
	createdAt: Date;
}
