import type { TSettingsQuizComponentProps } from "@features/quiz";
import { FormCheckboxLabelField } from "@shared/ui/form";
import { FieldGroup } from "@shared/ui/kit/field";
import { Text } from "@shared/ui/text";
import { useTranslation } from "react-i18next";

export const QuizSettingsAfterCompletion = ({ control }: TSettingsQuizComponentProps<object>) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-2">
			<Text variant="h6">{t("quiz_settings.after_completion.title")}</Text>
			<FieldGroup data-slot="checkbox-group" className="gap-3">
				<FormCheckboxLabelField control={control} name="isShowAnswersAfterCompletion" label="quiz_settings.after_completion.is_show_answers.label" />
			</FieldGroup>
		</div>
	);
};
