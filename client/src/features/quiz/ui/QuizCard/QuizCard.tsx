import { Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import type { QuizResponse } from "@shared/api/generated";
import { Text } from "@shared/ui/text";
import { Link } from "react-router-dom";

export const QuizCard = ({ id, title }: QuizResponse) => {
	return (
		<Card sx={{ width: "500px", height: "110px" }}>
			<Link to={`/quiz/${id}`}>
				<CardActionArea sx={{ width: "100%", display: "flex", padding: "10px", alignItems: "flex-start", justifyContent: "flex-start", gap: "10px" }}>
					<CardMedia component="img" image="/quiz_card_img.png" alt="quiz image" sx={{ width: "100px", flexShrink: 0 }} />
					<CardContent sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "5px 0", flexShrink: 1, overflow: "hidden" }}>
						<Text component="span" noWrap={true}>
							{title}
						</Text>
					</CardContent>
				</CardActionArea>
			</Link>
		</Card>
	);
};
