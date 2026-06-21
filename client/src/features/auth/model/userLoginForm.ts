import * as zod from "zod";

export interface ILoginFormValues {
	email: string;
	password: string;
}

export const loginFormValidationSchema = zod.object({
	email: zod.email("auth.form.validation_errors.email"),
	password: zod.string().min(8, "auth.form.validation_errors.password_min_length").max(255, "auth.form.validation_errors.password_max_length"),
});
