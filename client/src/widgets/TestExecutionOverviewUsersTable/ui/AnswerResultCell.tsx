import { Check, Minus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@shared/lib/utils";

type AnswerResult = {
	is_correct: boolean;
	skipped: boolean;
} | null;

interface AnswerResultCellProps {
	answer: AnswerResult;
}

export const AnswerResultCell = ({ answer }: AnswerResultCellProps) => {
	const { t } = useTranslation();

	if (!answer) {
		return (
			<span
				className="inline-flex size-7 items-center justify-center rounded-full bg-muted/60 text-muted-foreground/50"
				title={t("test_manage.answer.pending")}
				aria-label={t("test_manage.answer.pending")}
			>
				<span className="size-1.5 rounded-full bg-current" />
			</span>
		);
	}

	if (answer.skipped) {
		return (
			<span
				className="inline-flex size-7 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
				title={t("test_manage.answer.skipped")}
				aria-label={t("test_manage.answer.skipped")}
			>
				<Minus className="size-3.5" strokeWidth={2.5} />
			</span>
		);
	}

	return (
		<span
			className={cn(
				"inline-flex size-7 items-center justify-center rounded-full",
				answer.is_correct ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
			)}
			title={answer.is_correct ? t("test_manage.answer.correct") : t("test_manage.answer.incorrect")}
			aria-label={answer.is_correct ? t("test_manage.answer.correct") : t("test_manage.answer.incorrect")}
		>
			{answer.is_correct ? <Check className="size-3.5" strokeWidth={2.5} /> : <X className="size-3.5" strokeWidth={2.5} />}
		</span>
	);
};
