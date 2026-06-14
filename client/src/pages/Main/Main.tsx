import { useGetQuizes } from "@entities/quiz";
import { Box } from "@mui/material";
import { Text } from "@shared/ui/text";
import { QuizesList } from "./ui/QuizesList";

export const Main = () => {
	const { isLoading, error } = useGetQuizes();

	return (
		<>
			{isLoading ? (
				<span>Loading...</span>
			) : error ? (
				<span>{error.message}</span>
			) : (
				<Box sx={{ width: "100%", height: "100%", padding: "10px 20px", display: "flex", flexDirection: "column", gap: "20px" }}>
					<Text variant="h4">Ваши викторины</Text>
					<QuizesList />
				</Box>
			)}
		</>
	);
};
