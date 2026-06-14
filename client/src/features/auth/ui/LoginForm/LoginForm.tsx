import { Box } from "@mui/material";
import styles from "../../styles/AuthForm.module.scss";
import { FormTextField } from "@shared/ui/form";
import { DefaultButton } from "@shared/ui/button";
import { Text } from "@shared/ui/text";
import { useLoginForm } from "@features/auth/hooks/useLoginForm";

export const LoginForm = () => {
	const { isSubmitting, submitHandler, control, errors } = useLoginForm();

	return (
		<Box className={styles.container}>
			<Text variant="h4">Ввойдите в ваш аккаунт</Text>
			<form className={styles.form} onSubmit={submitHandler}>
				<FormTextField control={control} name="email" id="email" label="Email" required></FormTextField>
				<FormTextField control={control} name="password" id="password" label="Пароль" type="password" required autoComplete="none"></FormTextField>
				{errors.root && (
					<Text variant="body1" color="error">
						{errors.root.message}
					</Text>
				)}
				<DefaultButton type="submit" variant="outlined" isLoading={isSubmitting}>
					Войти
				</DefaultButton>
			</form>
		</Box>
	);
};
