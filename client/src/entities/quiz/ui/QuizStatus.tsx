import { useTranslation } from "react-i18next";
import { QuizResponseStatusEnum } from "@shared/api/generated";
import { cn } from "@shared/lib/utils";

const STATUS_LABEL_KEYS: Record<QuizResponseStatusEnum, string> = {
	[QuizResponseStatusEnum.Scheduler]: "quiz.status.scheduler",
	[QuizResponseStatusEnum.OpenByScheduler]: "quiz.status.open_by_scheduler",
	[QuizResponseStatusEnum.ManualOpen]: "quiz.status.manual_open",
	[QuizResponseStatusEnum.Closed]: "quiz.status.closed",
};

const STATUS_STYLES: Record<QuizResponseStatusEnum, { text: string; dot: string }> = {
	[QuizResponseStatusEnum.Scheduler]: {
		text: "text-sky-700 dark:text-sky-400",
		dot: "bg-sky-500",
	},
	[QuizResponseStatusEnum.OpenByScheduler]: {
		text: "text-green-600 dark:text-green-500",
		dot: "bg-green-500 dark:bg-green-400",
	},
	[QuizResponseStatusEnum.ManualOpen]: {
		text: "text-green-600 dark:text-green-500",
		dot: "bg-green-500 ring-1 ring-green-500/30 dark:bg-green-400 dark:ring-green-400/30",
	},
	[QuizResponseStatusEnum.Closed]: {
		text: "text-muted-foreground",
		dot: "bg-muted-foreground",
	},
};

export interface IQuizStatus {
	status: QuizResponseStatusEnum;
	className?: string;
}

export const QuizStatus = ({ status, className }: IQuizStatus) => {
	const { t } = useTranslation();
	const { text, dot } = STATUS_STYLES[status];

	return (
		<span className={cn("inline-flex w-fit shrink-0 items-center gap-1.5 text-sm font-medium leading-none uppercase", className)}>
			<span className={cn("size-2.5 shrink-0 rounded-full", dot)} aria-hidden />
			<span className={text}>{t(STATUS_LABEL_KEYS[status])}</span>
		</span>
	);
};
