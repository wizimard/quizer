import type { IEditConfigComponentProps } from "@features/quiz/model/editQuizForm";
import type { QuestionConfigInput } from "@shared/api/generated";
import { FormCheckboxField, FormTextField } from "@shared/ui/form";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Field, FieldLabel } from "@shared/ui/kit/field";

export const InputConfig = ({ control, name }: IEditConfigComponentProps<QuestionConfigInput>) => {
	const { t } = useTranslation();

	const ignoreCase = useWatch({ control, name: `${name}.ignore_case` });

	return (
		<>
			<FormTextField control={control} name={`${name}.answer`} placeholder="question_create_form.input.answer.placeholder" label="question_create_form.input.answer.label" />
			<Field orientation="horizontal" className="mt-1.5">
				<FormCheckboxField control={control} name={`${name}.ignore_case`} checked={ignoreCase} />
				<FieldLabel>{t("question_create_form.input.ignore_case.label")}</FieldLabel>
			</Field>
		</>
	);
};
