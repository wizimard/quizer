import { ChevronRight, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNextQuestion } from "../hooks/useNextQuestion";
import type { TestExecutionOverview } from "@entities/test";
import { Button } from "@shared/ui/kit/button";

export interface NextQuestionProps {
	testOverview: TestExecutionOverview;
}

export const NextQuestion = ({ testOverview }: NextQuestionProps) => {
	const { t } = useTranslation();
	const { nextQuestion, isLoading, canGoNext } = useNextQuestion(testOverview);

	if (!canGoNext) {
		return null;
	}

	return (
		<Button
			className="gap-1.5 border-emerald-500/25 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100/80 hover:text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300"
			size="sm"
			disabled={isLoading}
			onClick={nextQuestion}
		>
			{isLoading ? <Loader2 className="size-3.5 animate-spin" /> : null}
			{t("test_manage.current_question.next")}
			{!isLoading && <ChevronRight className="size-3.5" />}
		</Button>
	);
};
