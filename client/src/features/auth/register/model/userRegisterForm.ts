import * as zod from "zod";

export interface IRegisterFormValues {
	email: string;
	password: string;
	repeatPassword: string;
}

export const registerFormValidationSchema = zod
	.object({
		email: zod.email("auth.form.validation_errors.email"),
		password: zod.string().min(8, "auth.form.validation_errors.password_min_length").max(255, "auth.form.validation_errors.password_max_length"),
		repeatPassword: zod.string().min(8, "auth.form.validation_errors.password_min_length").max(255, "auth.form.validation_errors.password_max_length"),
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: "auth.form.validation_errors.confirm_password",
		path: ["repeatPassword"],
	});
