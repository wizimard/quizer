import { Box } from "@mui/material";
import styles from "../../styles/AuthForm.module.scss";
import { FormTextField } from "@shared/ui/form";
import { DefaultButton } from "@shared/ui/button";
import { Text } from "@shared/ui/text";
import { useRegisterForm } from "@features/auth/hooks/useRegisterForm";

export const RegisterForm = () => {
	const { isSubmitting, submitHandler, errors, control } = useRegisterForm();

	return (
		<Box className={styles.container}>
			<Text variant="h4">Создайте новый аккаунт</Text>
			<form className={styles.form} onSubmit={submitHandler}>
				<FormTextField control={control} name="email" id="email" label="Email" required></FormTextField>
				<FormTextField control={control} name="password" id="password" label="Пароль" type="password" required autoComplete="none"></FormTextField>
				<FormTextField control={control} name="repeatPassword" id="repeatPassword" label="Repeat password" type="password" required autoComplete="none"></FormTextField>
				{errors.root && (
					<Text variant="body1" color="error">
						{errors.root.message}
					</Text>
				)}
				<DefaultButton type="submit" variant="outlined" isLoading={isSubmitting}>
					Зарегистрироваться
				</DefaultButton>
			</form>
		</Box>
	);
};
