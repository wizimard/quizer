import * as zod from "zod";

export const testRegisterUserFormSchema = zod.object({
	first_name: zod.string().min(1, "test_execution_register.validation_errors.required"),
	last_name: zod.string().min(1, "test_execution_register.validation_errors.required"),
});

export type TestRegisterUserFormValues = zod.infer<typeof testRegisterUserFormSchema>;
