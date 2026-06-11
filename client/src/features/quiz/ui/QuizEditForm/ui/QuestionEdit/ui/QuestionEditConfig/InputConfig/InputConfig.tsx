import type { IEditConfigComponentProps } from "@features/quiz/model/editQuizForm";
import { FormControlLabel } from "@mui/material";
import type { QuestionConfigInput } from "@shared/api/generated";
import { FormCheckboxField, FormTextField } from "@shared/ui/form";
import { useWatch } from "react-hook-form";

export const InputConfig = ({ control, name }: IEditConfigComponentProps<QuestionConfigInput>) => {
	const ignoreCase = useWatch({ control, name: `${name}.ignore_case` });

	return (
		<>
			<FormTextField control={control} name={`${name}.answer`} placeholder="Введите ответ на вопрос" label="Ответ" />
			<FormControlLabel control={<FormCheckboxField control={control} name={`${name}.ignore_case`} checked={ignoreCase} />} label="игнорировать регистр" sx={{ marginTop: "5px" }} />
		</>
	);
};
