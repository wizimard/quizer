import * as zod from "zod";

export interface IRegisterFormValues {
	email: string;
	password: string;
	repeatPassword: string;
}

export const registerFormValidationSchema = zod
	.object({
		email: zod.email(),
		password: zod.string().min(8).max(255),
		repeatPassword: zod.string().min(8).max(255),
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: "Пароли должны совпадать",
		path: ["repeatPassword"],
	});
