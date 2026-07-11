import type { Control } from "react-hook-form";
import * as zod from "zod";

export const generalSettingsFormValidationSchema = zod.object({
	title: zod.string("test_general_settings_form.validation_errors.title").min(3, "test_general_settings_form.validation_errors.title_min_length"),
	isRequiredEmail: zod.boolean(),
	isRequiredFirstName: zod.boolean(),
	isRequiredLastName: zod.boolean(),
	isShowAnswersAfterCompletion: zod.boolean(),
});

export type GeneralSettingsTestForm = zod.infer<typeof generalSettingsFormValidationSchema>;

export type GeneralSettingsComponentProps<T> = T & {
	control: Control<GeneralSettingsTestForm, unknown, GeneralSettingsTestForm>;
};
