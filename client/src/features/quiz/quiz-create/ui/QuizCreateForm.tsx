import { useTranslation } from "react-i18next";
import { useQuizCreateForm } from "../hooks/useQuizCreateForm";
import { FormTextField } from "@shared/ui/form";
import { DefaultButton } from "@shared/ui/button";
import { Text } from "@shared/ui/text";

export const QuizCreateForm = () => {
	const { t } = useTranslation();

	const { control, handleSubmit, isLoading, formError } = useQuizCreateForm();

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
			<FormTextField control={control} name="title" placeholder="quiz_general_settings_form.title.placeholder" label="quiz_general_settings_form.title.label" className="mb-5" required />

			{formError?.message && <Text color="error">{t(formError.message)}</Text>}

			<DefaultButton type="submit" isLoading={isLoading} disabled={isLoading}>
				{t("quiz_list.add_button")}
			</DefaultButton>
		</form>
	);
};
