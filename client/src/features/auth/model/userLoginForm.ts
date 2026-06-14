import * as zod from "zod";

export interface ILoginFormValues {
	email: string;
	password: string;
}

export const loginFormValidationSchema = zod.object({
	email: zod.email(),
	password: zod.string().min(8).max(255),
});
