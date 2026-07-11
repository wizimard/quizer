import { CircleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@shared/ui/kit/card";
import { Text } from "@shared/ui/text";

export interface IErrorCardProps {
	message: string;
}

export const ErrorCard = ({ message }: IErrorCardProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex h-full w-full items-center justify-center p-4">
			<Card className="w-full max-w-md border-destructive/30 bg-destructive/5 ring-2 ring-destructive/20" role="alert">
				<CardContent className="flex flex-col items-center gap-3 py-6 text-center">
					<div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
						<CircleAlert className="size-5 text-destructive" aria-hidden />
					</div>
					<Text variant="body1" color="error" align="center">
						{t(message)}
					</Text>
				</CardContent>
			</Card>
		</div>
	);
};
