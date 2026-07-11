import zod from "zod";

export const createTestForm = zod.object({
	title: zod.string().min(1),
});

export type CreateTestForm = zod.infer<typeof createTestForm>;
