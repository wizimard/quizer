import { Link } from "react-router-dom";
import type { Test } from "../model/test.interface";
import { Card, CardContent } from "@shared/ui/kit/card";
import { Text } from "@shared/ui/text";

export const TestCard = ({ id, title }: Test) => {
	return (
		<Card className="h-[auto] w-[500px] p-0">
			<Link to={`/quiz/${id}`} className="flex h-full w-full items-start justify-start gap-2.5 p-2.5 transition-colors hover:bg-muted/50">
				<img src="/quiz_card_img.png" alt="quiz image" className="w-[100px] shrink-0" />
				<CardContent className="flex h-full w-full min-w-0 flex-col overflow-hidden p-0">
					<Text component="span">{title}</Text>
				</CardContent>
			</Link>
		</Card>
	);
};
