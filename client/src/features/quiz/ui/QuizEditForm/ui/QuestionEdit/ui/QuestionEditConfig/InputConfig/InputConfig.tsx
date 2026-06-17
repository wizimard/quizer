import type { IEditConfigComponentProps } from "@features/quiz/model/editQuizForm";
import { FormControlLabel } from "@mui/material";
import type { QuestionConfigInput } from "@shared/api/generated";
import { FormCheckboxField, FormTextField } from "@shared/ui/form";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const InputConfig = ({ control, name }: IEditConfigComponentProps<QuestionConfigInput>) => {
	const { t } = useTranslation();

	const ignoreCase = useWatch({ control, name: `${name}.ignore_case` });

	return (
		<>
			<FormTextField control={control} name={`${name}.answer`} placeholder="question_create_form.input.answer.placeholder" label="question_create_form.input.answer.label" />
			<FormControlLabel
				control={<FormCheckboxField control={control} name={`${name}.ignore_case`} checked={ignoreCase} />}
				label={t("question_create_form.input.ignore_case.label")}
				sx={{ marginTop: "5px" }}
			/>
		</>
	);
};
