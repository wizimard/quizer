import { Box } from "@mui/material";
import styles from "../../styles/AuthForm.module.scss";
import { FormTextField } from "@shared/ui/form";
import { DefaultButton } from "@shared/ui/button";
import { Text } from "@shared/ui/text";
import { useLoginForm } from "@features/auth/hooks/useLoginForm";
import { useTranslation } from "react-i18next";

export const LoginForm = () => {
	const { t } = useTranslation();

	const { isSubmitting, submitHandler, control, errors } = useLoginForm();

	return (
		<Box className={styles.container}>
			<Text variant="h4">{t("auth.login.title")}</Text>
			<form className={styles.form} onSubmit={submitHandler}>
				<FormTextField control={control} name="email" id="email" label="auth.form.fields.email" required></FormTextField>
				<FormTextField control={control} name="password" id="password" label="auth.form.fields.password" type="password" required autoComplete="none"></FormTextField>
				{errors.root && (
					<Text variant="body1" color="error">
						{t(errors.root.message)}
					</Text>
				)}
				<DefaultButton type="submit" variant="outlined" isLoading={isSubmitting}>
					{t("auth.login.button")}
				</DefaultButton>
			</form>
		</Box>
	);
};
