import { Box } from "@mui/material";
import styles from "../../styles/AuthForm.module.scss";
import { useForm } from "react-hook-form";
import { FormTextField } from "@shared/ui/form";
import { DefaultButton } from "@shared/ui/button";
import { useYupValidationResolver } from "@shared/hooks";
import { useEffect } from "react";
import { Text } from "@shared/ui/text";
import { type IRegisterFormValues, registerFormValidationSchema, useRegisterForm } from "@features/auth/model/userRegister";

export const RegisterForm = () => {
	const { isLoading, error, onSubmit } = useRegisterForm();

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<IRegisterFormValues>({
		defaultValues: {
			email: "",
			password: "",
			repeatPassword: "",
		},
		resolver: useYupValidationResolver(registerFormValidationSchema),
	});

	useEffect(() => {
		if (error) {
			setError("root", { message: error });
		}
	}, [error, setError]);

	return (
		<Box className={styles.container}>
			<Text variant="h4">Create your account</Text>
			<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
				<FormTextField control={control} name="email" id="email" label="Email" required></FormTextField>
				<FormTextField control={control} name="password" id="password" label="Password" type="password" required autoComplete="none"></FormTextField>
				<FormTextField control={control} name="repeatPassword" id="repeatPassword" label="Repeat password" type="password" required autoComplete="none"></FormTextField>
				{errors.root && (
					<Text variant="body1" color="error">
						{errors.root.message}
					</Text>
				)}
				<DefaultButton type="submit" variant="outlined" isLoading={isLoading}>
					Register
				</DefaultButton>
			</form>
		</Box>
	);
};
