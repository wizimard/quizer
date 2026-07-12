import { useTranslation } from "react-i18next";
import { FormTextField } from "@shared/ui/form";
import { DefaultButton } from "@shared/ui/button";
import { Typography } from "@shared/ui/typography";
import { useRegisterForm } from "@features/auth/register/hooks/useRegisterForm";

export const RegisterForm = () => {
	const { t } = useTranslation();

	const { isSubmitting, submitHandler, errors, control } = useRegisterForm();

	return (
		<div className="w-[426px] p-[20px] flex flex-col gap-[20px]">
			<Typography variant="h4">{t("auth.register.title")}</Typography>
			<form className="w-full flex flex-col gap-[20px]" onSubmit={submitHandler}>
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
				{errors.root?.message && (
					<Typography variant="body1" color="error">
						{t(errors.root.message)}
					</Typography>
				)}
				<DefaultButton type="submit" variant="outlined" isLoading={isSubmitting}>
					{t("auth.register.button")}
				</DefaultButton>
			</form>
		</div>
	);
};
