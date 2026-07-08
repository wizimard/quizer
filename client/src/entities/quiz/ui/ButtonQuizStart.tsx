import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ButtonHTMLAttributes } from "react";
import { Button } from "@shared/ui/kit/button";
import { cn } from "@shared/lib/utils";

export interface IButtonQuizStartProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ButtonQuizStart = ({ onClick, className, ...props }: IButtonQuizStartProps) => {
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
			{...props}
		>
			<Play className="size-3.5 fill-current" />
			{t("quiz.start")}
		</Button>
	);
};
