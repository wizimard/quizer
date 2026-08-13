import { useTranslation } from "react-i18next";
import { useQuestionForm } from "../../hooks/useQuestionForm";
import { QUESTION_TYPES_OPTIONS } from "../../model/question-type-options";
import { QuestionConfig } from "./ui/QuestionEditConfig";
import { FormSelectField, FormTextField } from "@shared/ui/form";
import { FormImageUploadField } from "@shared/ui/image-upload";
import type { Question } from "@entities/question";
import { DefaultButton } from "@shared/ui/button";
import { Typography } from "@shared/ui/typography";
import type { TestFull } from "@entities/test";

export interface QuestionFormProps {
	question: Question;
	test: TestFull;
}

export const QuestionForm = ({ question, test }: QuestionFormProps) => {
	const { t } = useTranslation();

	const { control, handleSubmit, isLoading, isDirty, resetForm, formError } = useQuestionForm(question, test);

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5">
			<fieldset disabled={test.isOpen} className="flex flex-col gap-5 disabled:pointer-events-none">
				<FormTextField control={control} name="description" placeholder="question_form.description.placeholder" label="question_form.description.label" multiline inputClassName="min-h-24" />

				<FormImageUploadField control={control} name="imageFile" existingImageUrl={question.image} label="question_form.image.label" hint="question_form.image.hint" />

				<FormTextField
					control={control}
					name="score"
					type="number"
					min={1}
					step={1}
					label="question_form.score.label"
					placeholder="question_form.score.placeholder"
					inputClassName="font-medium [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
				/>

				<FormSelectField control={control} name="config.type" options={QUESTION_TYPES_OPTIONS} label="question_form.type.label" placeholder="question_form.type.placeholder" id="config.type" />

				<div className="rounded-xl border border-border/70 bg-muted/15 p-4">
					<QuestionConfig control={control} />
				</div>
			</fieldset>

			{formError?.message && <Typography color="error">{t(formError.message)}</Typography>}

			<div className="flex gap-2.5 border-t border-border/60 pt-4">
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
