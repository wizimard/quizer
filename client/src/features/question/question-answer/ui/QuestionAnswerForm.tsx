import { useTranslation } from "react-i18next";

import { useQuestionAnswerForm } from "../hooks/useQuestionAnswerForm";
import { QuestionAnswer } from "./QuestionAnswer/QuestionAnswer";
import type { QuestionExecution } from "@entities/question/model/question-execution.interface";

import { DefaultButton } from "@shared/ui/button";

interface QuestionAnswerFormProps {
	question: QuestionExecution;
}

export const QuestionAnswerForm = ({ question }: QuestionAnswerFormProps) => {
	const { t } = useTranslation();

	const { control, submitHandler, isValid, isLoading, formError, skip } = useQuestionAnswerForm(question);

	return (
		<form className="flex flex-1 flex-col" onSubmit={submitHandler} noValidate>
			<section className="flex flex-1 flex-col">
				<fieldset className="w-full">
					<QuestionAnswer config={question.config} control={control} />
				</fieldset>
			</section>

			{formError?.message && <p className="text-red-500">{formError.message}</p>}

			<footer className="sticky bottom-0 shrink-0 border-t border-emerald-100/80 bg-background/90 px-4 py-4 backdrop-blur-sm dark:border-emerald-900/30">
				<div className="mx-auto flex w-full max-w-lg flex-col gap-2">
					<DefaultButton
						type="submit"
						size="lg"
						disabled={!isValid || isLoading}
						isLoading={isLoading}
						className="h-12 w-full rounded-xl bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 disabled:bg-emerald-200 disabled:text-emerald-600/70 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:disabled:bg-emerald-950/40 dark:disabled:text-emerald-700"
					>
						{t("test_execute.question.submit")}
					</DefaultButton>
					<DefaultButton
						type="button"
						size="lg"
						disabled={isLoading}
						onClick={skip}
						className="h-12 w-full rounded-xl bg-slate-300/50 text-base font-medium text-slate-600 hover:bg-slate-300/70 disabled:bg-slate-200/40 disabled:text-slate-400 dark:bg-slate-700/30 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:disabled:bg-slate-800/20 dark:disabled:text-slate-500"
					>
						{t("test_execute.question.skip")}
					</DefaultButton>
				</div>
			</footer>
		</form>
	);
};
