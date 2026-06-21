import { useGetQuizes } from "@entities/quiz";
import { Box } from "@mui/material";
import { Text } from "@shared/ui/text";
import { QuizesList } from "./ui/QuizesList";
import { DefaultButton } from "@shared/ui/button";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

export const Main = () => {
	const { isLoading, error } = useGetQuizes();

	const navigate = useNavigate();

	const handleClickNewQuiz = () => {
		navigate("/quiz-edit/new");
	};

	return (
		<>
			{isLoading ? (
				<span>Loading...</span>
			) : error ? (
				<span>{error.message}</span>
			) : (
				<Box sx={{ width: "100%", height: "100%", padding: "10px 20px", display: "flex", flexDirection: "column", gap: "20px" }}>
					<Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
						<Text variant="h4">Ваши викторины</Text>
						<DefaultButton sx={{ display: "flex", alignItems: "center", gap: "5px" }} onClick={handleClickNewQuiz}>
							<AddIcon />
							<Text sx={{ color: "#fff" }}>Добавить викторину</Text>
						</DefaultButton>
					</Box>
					<QuizesList />
				</Box>
			)}
		</>
	);
};
