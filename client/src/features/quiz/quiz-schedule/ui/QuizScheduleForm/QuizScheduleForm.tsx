import { useTranslation } from "react-i18next";
import { useQuizScheduleForm } from "../../hooks/useQuizScheduleForm";
import { QuizAvailablePeriods } from "./ui/QuizAvailablePeriods";
import { DefaultButton } from "@shared/ui/button";
import { type TQuiz } from "@entities/quiz";
import { Text } from "@shared/ui/text";

export interface IQuizScheduleFormProps {
	quiz: TQuiz;
}

export const QuizScheduleForm = ({ quiz }: IQuizScheduleFormProps) => {
	const { t } = useTranslation();

	const { control, submitHandler, resetForm, isSubmitting, isDirty, formError } = useQuizScheduleForm(quiz);

	return (
		<form onSubmit={submitHandler} className="flex flex-col gap-2.5">
			<QuizAvailablePeriods control={control} />

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
