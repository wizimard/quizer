import type { TestResponse } from "@shared/api/generated";

export interface Test extends Omit<TestResponse, "author_id" | "updated_at" | "created_at"> {
	authorId: string;
	updatedAt: Date;
	createdAt: Date;
}
