import { useTranslation } from "react-i18next";
import { useGeneralSettingsQuizForm } from "../../hooks/useGeneralSettingsQuizForm";
import { QuizSettingsAfterCompletion } from "./ui/QuizSettingsAfterCompletion";
import { QuizSettingsLoginData } from "./ui/QuizSettingsLoginData";
import { Separator } from "@shared/ui/kit/separator";
import { DefaultButton } from "@shared/ui/button";
import { type TQuiz } from "@entities/quiz";
import { FormTextField } from "@shared/ui/form";
import { Text } from "@shared/ui/text";

export interface IQuizGeneralSettingsFormProps {
	quiz: TQuiz;
}

export const QuizGeneralSettingsForm = ({ quiz }: IQuizGeneralSettingsFormProps) => {
	const { t } = useTranslation();

	const { control, submitHandler, resetForm, isSubmitting, isDirty, formError } = useGeneralSettingsQuizForm(quiz);

	return (
		<form onSubmit={submitHandler} className="flex flex-col gap-2.5">
			<FormTextField control={control} name="title" placeholder="quiz_general_settings_form.title.placeholder" label="quiz_general_settings_form.title.label" className="mb-5" />
			<QuizSettingsLoginData control={control} />
			<Separator className="mt-2" />

			<QuizSettingsAfterCompletion control={control} />

			{formError?.message && <Text color="error">{t(formError.message)}</Text>}

			<div className="mt-2.5 flex gap-2.5">
				<DefaultButton type="submit" isLoading={isSubmitting} disabled={!isDirty} onClick={submitHandler}>
					{t("common.button_save")}
				</DefaultButton>
				<DefaultButton variant="ghost" className="text-zinc-900" disabled={!isDirty} onClick={resetForm}>
					{t("common.button_cancel")}
				</DefaultButton>
			</div>
		</form>
	);
};
