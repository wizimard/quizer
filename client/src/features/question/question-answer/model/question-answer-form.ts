import zod from "zod";
import type { Control } from "react-hook-form";
import type { QuestionExecuteConfig } from "@shared/api/generated";

const inputAnswerSchema = zod.object({
	type: zod.literal("input"),
	value: zod.string().trim().min(1, "test_execute.question.validation_errors.input_required"),
});

const singleChoiceAnswerSchema = zod.object({
	type: zod.literal("single_choice"),
	optionId: zod.string().min(1, "test_execute.question.validation_errors.single_choice_required"),
});

const multipleChoiceAnswerSchema = zod.object({
	type: zod.literal("multiple_choice"),
	optionIds: zod.array(zod.string()).min(1, "test_execute.question.validation_errors.multiple_choice_required"),
});

export const questionAnswerFormModelSchema = zod.discriminatedUnion("type", [inputAnswerSchema, singleChoiceAnswerSchema, multipleChoiceAnswerSchema], {
	error: (issue) => {
		if (issue.code === "invalid_union") {
			return "test_execute.question.validation_errors.question_type";
		}
		return issue.message;
	},
});

export type QuestionAnswerFormValues = zod.infer<typeof questionAnswerFormModelSchema>;

export type QuestionAnswerFormComponentProps<T> = T & {
	control: Control<QuestionAnswerFormValues>;
};

export const createDefaultAnswerFormValues = (type: QuestionExecuteConfig["type"]): QuestionAnswerFormValues | undefined => {
	switch (type) {
		case "input":
			return { type: "input", value: "" };
		case "single_choice":
			return { type: "single_choice", optionId: "" };
		case "multiple_choice":
			return { type: "multiple_choice", optionIds: [] };
	}
};

export const extractAnswerFormValues = (values: QuestionAnswerFormValues) => {
	switch (values.type) {
		case "input":
			return values.value;
		case "single_choice":
			return values.optionId;
		case "multiple_choice":
			return values.optionIds;
	}
};
