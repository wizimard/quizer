import type { TSettingsQuizComponentProps } from "@features/quiz";
import { FormCheckboxLabelField } from "@shared/ui/form";
import { FieldGroup } from "@shared/ui/kit/field";
import { Text } from "@shared/ui/text";
import { useTranslation } from "react-i18next";

export const QuizSettingsLoginData = ({ control }: TSettingsQuizComponentProps<object>) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-2">
			<Text variant="h6">{t("quiz_settings.login_data.title")}</Text>
			<FieldGroup data-slot="checkbox-group" className="gap-3">
				<FormCheckboxLabelField control={control} name="isRequiredEmail" label="quiz_settings.login_data.is_required_email.label" />
				<FormCheckboxLabelField control={control} name="isRequiredFirstName" label="quiz_settings.login_data.is_required_first_name.label" />
				<FormCheckboxLabelField control={control} name="isRequiredLastName" label="quiz_settings.login_data.is_required_last_name.label" />
			</FieldGroup>
		</div>
	);
};
