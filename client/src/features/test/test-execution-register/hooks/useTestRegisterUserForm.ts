import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { useEffect } from "react";
import { testRegisterUserFormSchema, type TestRegisterUserFormValues } from "../model/registerForm";
import { useTestRegisterUser } from "./useTestRegisterUser";

export const useTestRegisterUserForm = (testId: string) => {
	const {
		control,
		handleSubmit,
		formState: {
			isSubmitting,
			errors: { root: formError },
		},
		setError,
	} = useForm<TestRegisterUserFormValues>({
		defaultValues: {
			first_name: "",
			last_name: "",
		},
		resolver: zodResolver(testRegisterUserFormSchema) as Resolver<TestRegisterUserFormValues>,
	});

	const { registerUser, isLoading, error } = useTestRegisterUser(testId, setError);

	const submitHandler = handleSubmit((data) => {
		registerUser(data);
	});

	useEffect(() => {
		if (error) {
			setError("root", { message: error.message });
		}
	}, [error, setError]);

	return { control, submitHandler, isSubmitting, isLoading, formError };
};
