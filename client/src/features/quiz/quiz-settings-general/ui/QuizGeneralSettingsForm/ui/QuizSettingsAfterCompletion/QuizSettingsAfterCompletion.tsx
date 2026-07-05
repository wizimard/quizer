import { useTranslation } from "react-i18next";
import type { TGeneralSettingsComponentProps } from "@features/quiz/quiz-settings-general/model/generalSettingsForm";
import { FormCheckboxLabelField } from "@shared/ui/form";
import { FieldGroup } from "@shared/ui/kit/field";
import { Text } from "@shared/ui/text";

export const QuizSettingsAfterCompletion = ({ control }: TGeneralSettingsComponentProps<object>) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-2">
			<Text variant="h6">{t("quiz_general_settings_form.after_completion.title")}</Text>
			<FieldGroup data-slot="checkbox-group" className="gap-3">
				<FormCheckboxLabelField control={control} name="isShowAnswersAfterCompletion" label="quiz_general_settings_form.after_completion.is_show_answers.label" />
			</FieldGroup>
		</div>
	);
};
