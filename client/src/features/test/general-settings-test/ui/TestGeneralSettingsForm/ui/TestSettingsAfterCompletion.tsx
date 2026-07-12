import { useTranslation } from "react-i18next";
import { FormCheckboxLabelField } from "@shared/ui/form";
import { FieldGroup } from "@shared/ui/kit/field";
import { Typography } from "@shared/ui/typography";
import type { GeneralSettingsComponentProps } from "@features/test/general-settings-test/model/generalSettingsForm";

export const TestSettingsAfterCompletion = ({ control }: GeneralSettingsComponentProps<object>) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-2">
			<Typography variant="h6">{t("test_general_settings_form.after_completion.title")}</Typography>
			<FieldGroup data-slot="checkbox-group" className="gap-3">
				<FormCheckboxLabelField control={control} name="isShowAnswersAfterCompletion" label="test_general_settings_form.after_completion.is_show_answers.label" />
			</FieldGroup>
		</div>
	);
};
