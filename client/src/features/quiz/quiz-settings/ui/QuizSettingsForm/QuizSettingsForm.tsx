import { DefaultButton } from "@shared/ui/button";
import { Separator } from "@shared/ui/kit/separator";
import { useSettingsQuizForm } from "../../hooks/useSettingsQuizForm";
import { useTranslation } from "react-i18next";
import { QuizAvailablePeriods } from "./ui/QuizAvailablePeriods";
import { QuizSettingsAfterCompletion } from "./ui/QuizSettingsAfterCompletion";
import { QuizSettingsLoginData } from "./ui/QuizSettingsLoginData";
import { type TQuiz } from "@entities/quiz";

export interface IQuizSettingsFormProps {
	quiz: TQuiz;
}

export const QuizSettingsForm = ({ quiz }: IQuizSettingsFormProps) => {
	const { t } = useTranslation();

	const { control, submitHandler, resetForm, isSubmitting, isDirty } = useSettingsQuizForm(quiz);

	return (
		<form onSubmit={submitHandler} className="flex flex-col gap-2.5">
			<QuizSettingsLoginData control={control} />
			<Separator className="mt-2" />

			<QuizSettingsAfterCompletion control={control} />
			<Separator className="mt-2" />

			<QuizAvailablePeriods control={control} />

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
