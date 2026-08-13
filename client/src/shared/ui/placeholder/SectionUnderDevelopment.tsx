import { Construction } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@shared/ui/kit/card";
import { Typography } from "@shared/ui/typography";

export interface SectionUnderDevelopmentProps {
	title?: string;
	description?: string;
}

export const SectionUnderDevelopment = ({ title = "common.section_under_development.title", description = "common.section_under_development.description" }: SectionUnderDevelopmentProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex h-full w-full items-center justify-center p-4">
			<Card className="w-full max-w-md border-muted bg-muted/30" role="status">
				<CardContent className="flex flex-col items-center gap-3 py-6 text-center">
					<div className="flex size-10 items-center justify-center rounded-full bg-muted">
						<Construction className="size-5 text-muted-foreground" aria-hidden />
					</div>
					<div className="flex flex-col gap-1">
						<Typography variant="subtitle1" align="center" className="text-foreground">
							{t(title)}
						</Typography>
						<Typography variant="body2" align="center">
							{t(description)}
						</Typography>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
