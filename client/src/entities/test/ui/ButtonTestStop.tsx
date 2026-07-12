import { Loader2, Square } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ButtonHTMLAttributes } from "react";
import { Button } from "@shared/ui/kit/button";
import { cn } from "@shared/lib/utils";

export interface IButtonTestStopProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	isLoading?: boolean;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ButtonTestStop = ({ onClick, className, isLoading, ...props }: IButtonTestStopProps) => {
	const { t } = useTranslation();

	return (
		<Button
			variant="outline"
			size="sm"
			className={cn(
				className,
				"gap-1.5 font-medium uppercase border-border text-muted-foreground hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
			)}
			onClick={onClick}
			disabled={isLoading}
			{...props}
		>
			{isLoading ? <Loader2 className="size-3.5 fill-current" /> : <Square className="size-3.5 fill-current" />}
			{t("test.close")}
		</Button>
	);
};
