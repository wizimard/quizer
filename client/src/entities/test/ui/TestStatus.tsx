import { useTranslation } from "react-i18next";
import { TestResponseStatusEnum } from "@shared/api/generated";
import { cn } from "@shared/lib/utils";

const STATUS_LABEL_KEYS: Record<TestResponseStatusEnum, string> = {
	[TestResponseStatusEnum.Open]: "test.status.open",
	[TestResponseStatusEnum.OpenByScheduler]: "test.status.open_by_scheduler",
	[TestResponseStatusEnum.Closed]: "test.status.closed",
};

const STATUS_STYLES: Record<TestResponseStatusEnum, { text: string; dot: string }> = {
	[TestResponseStatusEnum.Open]: {
		text: "text-sky-700 dark:text-sky-400",
		dot: "bg-sky-500",
	},
	[TestResponseStatusEnum.OpenByScheduler]: {
		text: "text-green-600 dark:text-green-500",
		dot: "bg-green-500 dark:bg-green-400",
	},
	[TestResponseStatusEnum.Closed]: {
		text: "text-muted-foreground",
		dot: "bg-muted-foreground",
	},
};

export interface ITestStatusProps {
	status: TestResponseStatusEnum;
	className?: string;
}

export const TestStatus = ({ status, className }: ITestStatusProps) => {
	const { t } = useTranslation();
	const { text, dot } = STATUS_STYLES[status];

	return (
		<span className={cn("inline-flex w-fit shrink-0 items-center gap-1.5 text-sm font-medium leading-none uppercase", className)}>
			<span className={cn("size-2.5 shrink-0 rounded-full", dot)} aria-hidden />
			<span className={text}>{t(STATUS_LABEL_KEYS[status])}</span>
		</span>
	);
};
