import { useTranslation } from "react-i18next";
import type { GeneralSettingsComponentProps } from "@features/test/general-settings-test/model/generalSettingsForm";
import { FormCheckboxLabelField } from "@shared/ui/form";
import { FieldGroup } from "@shared/ui/kit/field";
import { Text } from "@shared/ui/text";

export const TestSettingsLoginData = ({ control }: GeneralSettingsComponentProps<object>) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-2">
			<Text variant="h6">{t("test_general_settings_form.login_data.title")}</Text>
			<FieldGroup data-slot="checkbox-group" className="gap-3">
				<FormCheckboxLabelField control={control} name="isRequiredEmail" label="test_general_settings_form.login_data.is_required_email.label" />
				<FormCheckboxLabelField control={control} name="isRequiredFirstName" label="test_general_settings_form.login_data.is_required_first_name.label" />
				<FormCheckboxLabelField control={control} name="isRequiredLastName" label="test_general_settings_form.login_data.is_required_last_name.label" />
			</FieldGroup>
		</div>
	);
};
