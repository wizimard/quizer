import type { ReactNode } from "react";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Typography } from "@shared/ui/typography";

interface WaitingToStartViewProps {
	action: ReactNode;
}

export const WaitingToStartView = ({ action }: WaitingToStartViewProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex min-h-64 flex-col rounded-xl bg-muted/20 ring-1 ring-foreground/10">
			<div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
				<div className="flex size-14 items-center justify-center rounded-full bg-muted">
					<Users className="size-6 text-muted-foreground" aria-hidden />
				</div>

				<div className="flex max-w-md flex-col gap-2">
					<Typography variant="subtitle1" className="text-foreground">
						{t("test_manage.current_question.waiting.title")}
					</Typography>
					<Typography variant="body2" className="text-muted-foreground leading-relaxed">
						{t("test_manage.current_question.waiting.description")}
					</Typography>
				</div>
			</div>

			<div className="flex justify-center border-t border-border/60 px-6 py-4">{action}</div>
		</div>
	);
};
