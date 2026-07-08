import { Square } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ButtonHTMLAttributes } from "react";
import { Button } from "@shared/ui/kit/button";
import { cn } from "@shared/lib/utils";

export interface IButtonQuizStopProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ButtonQuizStop = ({ onClick, className, ...props }: IButtonQuizStopProps) => {
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
			{...props}
		>
			<Square className="size-3.5 fill-current" />
			{t("quiz.close")}
		</Button>
	);
};
