import { useTranslation } from "react-i18next";
import { useQuestionForm } from "../../hooks/useQuestionForm";
import { QUESTION_TYPES_OPTIONS } from "../../model/question-type-options";
import { QuestionConfig } from "./ui/QuestionEditConfig";
import { FormSelectField, FormTextField } from "@shared/ui/form";
import type { Question } from "@entities/question";
import { DefaultButton } from "@shared/ui/button";
import { Text } from "@shared/ui/text";

export interface QuestionFormProps {
	question: Question;
}

export const QuestionForm = ({ question }: QuestionFormProps) => {
	const { t } = useTranslation();

	const { control, handleSubmit, isLoading, isDirty, resetForm, formError } = useQuestionForm(question);

	return (
		<form onSubmit={handleSubmit}>
			<FormTextField control={control} name="description" placeholder="question_form.description.placeholder" label="question_form.description.label" className="mb-5" multiline />
			<FormSelectField control={control} name="config.type" options={QUESTION_TYPES_OPTIONS} label="question_form.type.label" placeholder="question_form.type.placeholder" id="config.type" />
			<QuestionConfig control={control} />

			{formError?.message && <Text color="error">{t(formError.message)}</Text>}

			<div className="mt-2.5 flex gap-2.5">
				<DefaultButton type="submit" isLoading={isLoading} disabled={!isDirty}>
					{t("common.button_save")}
				</DefaultButton>
				<DefaultButton variant="ghost" className="text-zinc-900" disabled={!isDirty} onClick={resetForm}>
					{t("common.button_cancel")}
				</DefaultButton>
			</div>
		</form>
	);
};
