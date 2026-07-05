import type { Control } from "react-hook-form";
import * as zod from "zod";
import type { QuizSettingsUpdateRequestBody } from "@shared/api/generated";

export type IGeneralSettingsQuiz = QuizSettingsUpdateRequestBody;

export const generalSettingsFormValidationSchema = zod.object({
	title: zod.string("quiz_general_settings_form.validation_errors.title").min(3, "quiz_general_settings_form.validation_errors.title_min_length"),
	isRequiredEmail: zod.boolean(),
	isRequiredFirstName: zod.boolean(),
	isRequiredLastName: zod.boolean(),
	isShowAnswersAfterCompletion: zod.boolean(),
});

export type TGeneralSettingsQuizForm = zod.infer<typeof generalSettingsFormValidationSchema>;

export type TGeneralSettingsComponentProps<T> = T & {
	control: Control<IGeneralSettingsQuiz, unknown, IGeneralSettingsQuiz>;
};
