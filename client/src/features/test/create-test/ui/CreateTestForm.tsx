import { useTranslation } from "react-i18next";
import { useContext, useEffect } from "react";
import { useCreateTestForm } from "../hooks/useCreateTestForm";
import { FormTextField } from "@shared/ui/form";
import { DefaultButton } from "@shared/ui/button";
import { Text } from "@shared/ui/text";
import { dialogContext } from "@shared/ui/dialog";

export const CreateTestForm = () => {
	const { t } = useTranslation();

	const { lock, unlock } = useContext(dialogContext);

	const { control, handleSubmit, isLoading, formError } = useCreateTestForm();

	useEffect(() => {
		if (isLoading) {
			lock();
			return;
		}

		unlock();
	}, [isLoading, lock, unlock]);

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
			<FormTextField control={control} name="title" placeholder="test_general_settings_form.title.placeholder" label="test_general_settings_form.title.label" className="mb-5" required />

			{formError?.message && <Text color="error">{t(formError.message)}</Text>}

			<DefaultButton type="submit" isLoading={isLoading} disabled={isLoading}>
				{t("test_list.add_button")}
			</DefaultButton>
		</form>
	);
};
