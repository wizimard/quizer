import { useWatch } from "react-hook-form";
import type { QuestionConfigInput } from "@shared/api/generated";
import { FormCheckboxLabelField, FormTextField } from "@shared/ui/form";
import type { QuestionFormComponentProps } from "@features/question/question-insert/model/question-form";

export const InputConfig = ({ control }: QuestionFormComponentProps<QuestionConfigInput>) => {
	const ignoreCase = useWatch({ control, name: `config.ignore_case` });

	return (
		<>
			<FormTextField control={control} name={`config.answer`} placeholder="question_form.input.answer.placeholder" label="question_form.input.answer.label" multiline />
			<FormCheckboxLabelField control={control} name={`config.ignore_case`} label="question_form.input.ignore_case.label" checked={ignoreCase} className="mt-2" />
		</>
	);
};
