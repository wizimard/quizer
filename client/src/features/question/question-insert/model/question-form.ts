import zod from "zod";
import type { Control } from "react-hook-form";
import { normalizeOptionsForm } from "./question-type-options";
import type { Question } from "@entities/question";

export type TQuestionFormModel = Omit<Question, "id" | "testId" | "sortKey" | "image"> & {
	imageFile: File | null;
};

const optionSchema = zod.object({
	id: zod.string(),
	optionId: zod.string(),
	value: zod.string().min(1, "question_form.validation_errors.option_value"),
});

export type TQuestionFormOption = zod.infer<typeof optionSchema>;

export const questionFormModelSchema = zod.object({
	description: zod.string().min(1, "question_form.validation_errors.question_description"),
	score: zod.number().int().min(1, "question_form.validation_errors.score_min"),
	imageFile: zod.instanceof(File).nullable(),
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

export const getFormQuestionValues = (question: Question): TQuestionForm => {
	const baseValues = {
		description: question.description,
		score: question.score,
		imageFile: null,
	};

	if (!("options" in question.config)) {
		return {
			...baseValues,
			config: question.config as TQuestionForm["config"],
		};
	}

	return {
		...baseValues,
		config: {
			...question.config,
			options: normalizeOptionsForm(question.config.options),
		} as TQuestionForm["config"],
	};
};
