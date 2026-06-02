import { Box } from "@mui/material";
import styles from "../../styles/AuthForm.module.scss";
import { useForm } from "react-hook-form";
import { FormTextField } from "@shared/ui/form";
import { DefaultButton } from "@shared/ui/button";
import { useYupValidationResolver } from "@shared/hooks";
import { useEffect } from "react";
import { Text } from "@shared/ui/text";
import { type ILoginFormValues, loginFormValidationSchema, useLoginForm } from "@features/auth/model/userLogin";

export const LoginForm = () => {
	const { isLoading, onSubmit, error } = useLoginForm();

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<ILoginFormValues>({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: useYupValidationResolver(loginFormValidationSchema),
	});

	useEffect(() => {
		if (error) {
			setError("root", { message: error });
		}
	}, [error, setError]);

	return (
		<Box className={styles.container}>
			<Text variant="h4">Login to your Account</Text>
			<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
				<FormTextField control={control} name="email" id="email" label="Email" required></FormTextField>
				<FormTextField control={control} name="password" id="password" label="Password" type="password" required autoComplete="none"></FormTextField>
				{errors.root && (
					<Text variant="body1" color="error">
						{errors.root.message}
					</Text>
				)}
				<DefaultButton type="submit" variant="outlined" isLoading={isLoading}>
					Login
				</DefaultButton>
			</form>
		</Box>
	);
};
