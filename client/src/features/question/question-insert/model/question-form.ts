import zod from "zod";
import type { Control } from "react-hook-form";
import type { Question } from "@entities/question";

export type TQuestionFormModel = Omit<Question, "id" | "testId" | "sortKey">;

const optionSchema = zod.object({
	id: zod.string(),
	optionId: zod.string(),
	value: zod.string().min(1, "question_form.validation_errors.option_value"),
});

export type TQuestionFormOption = zod.infer<typeof optionSchema>;

export const questionFormModelSchema = zod.object({
	description: zod.string().min(1, "question_form.validation_errors.question_description"),
	config: zod.discriminatedUnion(
		"type",
		[
			zod.object({
				type: zod.literal("input"),
				answer: zod.string().trim().min(1, "question_form.validation_errors.answer_input"),
				ignore_case: zod.boolean(),
			}),
			zod.object({
				type: zod.literal("single_choice"),
				answer: zod.string().min(1, "question_form.validation_errors.answer_single_choise"),
				options: zod.array(optionSchema),
			}),
			zod.object({
				type: zod.literal("multiple_choice"),
				answer: zod.array(zod.string()).min(1, "question_form.validation_errors.answer_multiple_choise"),
				options: zod.array(optionSchema),
			}),
		],
		{
			error: (issue) => {
				if (issue.code === "invalid_union") {
					return "question_form.validation_errors.question_type";
				}
				return issue.message;
			},
		},
	),
});

export type TQuestionForm = zod.infer<typeof questionFormModelSchema>;

export type QuestionFormComponentProps<T> = T & {
	control: Control<TQuestionForm>;
};
