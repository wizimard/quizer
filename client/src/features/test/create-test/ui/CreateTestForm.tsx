import { useTranslation } from "react-i18next";
import { useCreateTestForm } from "../hooks/useCreateTestForm";
import { FormTextField } from "@shared/ui/form";
import { DefaultButton } from "@shared/ui/button";
import { Typography } from "@shared/ui/typography";

export const CreateTestForm = () => {
	const { t } = useTranslation();

	const { control, handleSubmit, isLoading, formError } = useCreateTestForm();

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
			<FormTextField control={control} name="title" placeholder="test_general_settings_form.title.placeholder" label="test_general_settings_form.title.label" className="mb-5" required />

			{formError?.message && <Typography color="error">{t(formError.message)}</Typography>}

			<DefaultButton type="submit" isLoading={isLoading} disabled={isLoading}>
				{t("test_list.add_button")}
			</DefaultButton>
		</form>
	);
};
