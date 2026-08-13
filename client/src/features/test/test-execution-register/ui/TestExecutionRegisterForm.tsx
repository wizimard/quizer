import { useTranslation } from "react-i18next";
import { useTestRegisterUserForm } from "../hooks/useTestRegisterUserForm";
import { DefaultButton } from "@shared/ui/button";
import { FormTextField } from "@shared/ui/form";
import { Typography } from "@shared/ui/typography";

interface TestRegisterUserFormProps {
	testId: string;
}

export const TestExecutionRegisterForm = ({ testId }: TestRegisterUserFormProps) => {
	const { t } = useTranslation();

	const { control, submitHandler, isSubmitting, formError } = useTestRegisterUserForm(testId);

	return (
		<form className="flex w-full flex-col gap-4" onSubmit={submitHandler}>
			<fieldset className="w-full flex flex-col gap-4">
				<FormTextField
					control={control}
					name="first_name"
					id="first_name"
					label={t("test_execution_register.fields.first_name.label")}
					placeholder={t("test_execution_register.fields.first_name.placeholder")}
					required
				/>
				<FormTextField
					control={control}
					name="last_name"
					id="last_name"
					label={t("test_execution_register.fields.last_name.label")}
					placeholder={t("test_execution_register.fields.last_name.placeholder")}
					required
				/>
			</fieldset>

			{formError?.message && <Typography color="error">{t(formError.message)}</Typography>}

			<DefaultButton type="submit" variant="contained" className="mt-2 h-11 w-full text-base" isLoading={isSubmitting}>
				{t("test_execution_register.submit")}
			</DefaultButton>
		</form>
	);
};
