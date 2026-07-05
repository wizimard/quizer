import { FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DefaultButton } from "@shared/ui/button";
import { Card, CardContent } from "@shared/ui/kit/card";
import { CenterElement } from "@shared/ui/layout";
import { Text } from "@shared/ui/text";

export const NotFound = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<CenterElement className="p-4">
			<Card className="w-full max-w-md">
				<CardContent className="flex flex-col items-center gap-4 py-10 text-center">
					<Text variant="h1" className="text-8xl font-bold text-muted-foreground/25 select-none" aria-hidden>
						404
					</Text>
					<div className="flex size-12 items-center justify-center rounded-full bg-muted">
						<FileQuestion className="size-6 text-muted-foreground" aria-hidden />
					</div>
					<div className="flex flex-col gap-2">
						<Text variant="h4" align="center">
							{t("not_found.title")}
						</Text>
						<Text variant="body2" align="center" className="text-muted-foreground">
							{t("not_found.description")}
						</Text>
					</div>
					<DefaultButton variant="outlined" onClick={() => navigate("/")}>
						{t("not_found.button")}
					</DefaultButton>
				</CardContent>
			</Card>
		</CenterElement>
	);
};
