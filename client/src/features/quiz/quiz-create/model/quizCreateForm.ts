import z from "zod";

export const quizCreateForm = z.object({
	title: z.string().min(1),
});

export type TQuizCreateForm = z.infer<typeof quizCreateForm>;
