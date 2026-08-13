import { ChevronRight, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNextQuestion } from "../hooks/useNextQuestion";
import { useStopTest } from "@features/test/stop-test";
import type { TestExecutionOverview } from "@entities/test";
import { Button } from "@shared/ui/kit/button";

export interface NextQuestionProps {
	testOverview: TestExecutionOverview;
}

export const NextQuestion = ({ testOverview }: NextQuestionProps) => {
	const { t } = useTranslation();
	const { nextQuestion, isLoading: isNextLoading, canGoNext } = useNextQuestion(testOverview);
	const { stopTest, isLoading: isStopLoading } = useStopTest({ id: testOverview.id, isOpen: true });

	if (!canGoNext) {
		return (
			<Button
				className="gap-1.5 border-red-500/25 bg-red-50/80 text-red-800 hover:bg-red-100/80 hover:text-red-800 dark:border-red-500/20 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60 dark:hover:text-red-300"
				size="sm"
				disabled={isStopLoading}
				onClick={stopTest}
			>
				{isStopLoading ? <Loader2 className="size-3.5 animate-spin" /> : null}
				{t("test_manage.current_question.finish")}
			</Button>
		);
	}

	return (
		<Button
			className="gap-1.5 border-emerald-500/25 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100/80 hover:text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300"
			size="sm"
			disabled={isNextLoading}
			onClick={nextQuestion}
		>
			{isNextLoading ? <Loader2 className="size-3.5 animate-spin" /> : null}
			{t("test_manage.current_question.next")}
			{!isNextLoading && <ChevronRight className="size-3.5" />}
		</Button>
	);
};
