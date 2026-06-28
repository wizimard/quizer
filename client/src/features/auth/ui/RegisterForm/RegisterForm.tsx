import styles from "../../styles/AuthForm.module.scss";
import { FormTextField } from "@shared/ui/form";
import { DefaultButton } from "@shared/ui/button";
import { Text } from "@shared/ui/text";
import { useRegisterForm } from "@features/auth/hooks/useRegisterForm";
import { useTranslation } from "react-i18next";

export const RegisterForm = () => {
	const { t } = useTranslation();

	const { isSubmitting, submitHandler, errors, control } = useRegisterForm();

	return (
		<div className={styles.container}>
			<Text variant="h4">{t("auth.register.title")}</Text>
			<form className={styles.form} onSubmit={submitHandler}>
				<FormTextField control={control} name="email" id="email" label="auth.form.fields.email.label" placeholder="auth.form.fields.email.placeholder" required></FormTextField>
				<FormTextField
					control={control}
					name="password"
					id="password"
					label="auth.form.fields.password.label"
					placeholder="auth.form.fields.password.placeholder"
					type="password"
					required
					autoComplete="none"
				></FormTextField>
				<FormTextField
					control={control}
					name="repeatPassword"
					id="repeatPassword"
					label="auth.form.fields.repeat_password.label"
					placeholder="auth.form.fields.repeat_password.placeholder"
					type="password"
					required
					autoComplete="none"
				></FormTextField>
				{errors.root && (
					<Text variant="body1" color="error">
						{t(errors.root.message)}
					</Text>
				)}
				<DefaultButton type="submit" variant="outlined" isLoading={isSubmitting}>
					{t("auth.register.button")}
				</DefaultButton>
			</form>
		</div>
	);
};
