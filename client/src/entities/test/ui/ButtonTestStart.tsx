import { Loader2, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ButtonHTMLAttributes } from "react";
import { Button } from "@shared/ui/kit/button";
import { cn } from "@shared/lib/utils";

export interface IButtonTestStartProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	isLoading?: boolean;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ButtonTestStart = ({ onClick, className, isLoading, ...props }: IButtonTestStartProps) => {
	const { t } = useTranslation();

	return (
		<Button
			variant="outline"
			size="sm"
			className={cn(
				className,
				"gap-1.5 font-medium uppercase border-green-600/30 bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700 dark:border-green-500/30 dark:text-green-500 dark:hover:bg-green-500/20 dark:hover:text-green-400",
			)}
			onClick={onClick}
			disabled={isLoading}
			{...props}
		>
			{isLoading ? <Loader2 className="size-3.5 fill-current" /> : <Play className="size-3.5 fill-current" />}
			{t("test.start")}
		</Button>
	);
};
