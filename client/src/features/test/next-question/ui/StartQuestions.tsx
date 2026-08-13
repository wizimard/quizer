import { Loader2, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNextQuestion } from "../hooks/useNextQuestion";
import type { TestExecutionOverview } from "@entities/test";
import { Button } from "@shared/ui/kit/button";

export interface StartQuestionsProps {
	testOverview: TestExecutionOverview;
}

export const StartQuestions = ({ testOverview }: StartQuestionsProps) => {
	const { t } = useTranslation();
	const { nextQuestion, isLoading, canGoNext } = useNextQuestion(testOverview);

	return (
		<Button
			className="mx-auto w-full max-w-[400px] gap-2 border-emerald-500/25 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100/80 hover:text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300"
			size="lg"
			disabled={!canGoNext || isLoading}
			onClick={nextQuestion}
		>
			{isLoading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4 fill-current" />}
			{t("test_manage.current_question.start")}
		</Button>
	);
};
