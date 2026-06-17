import { useGetQuizes } from "@entities/quiz";
import { Box } from "@mui/material";
import { Text } from "@shared/ui/text";
import { QuizesList } from "./ui/QuizesList";
import { DefaultButton } from "@shared/ui/button";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { LoadingLayout } from "@shared/ui/layout";
import { useTranslation } from "react-i18next";

export const Main = () => {
	const { t } = useTranslation();

	const { isLoading, error } = useGetQuizes();

	const navigate = useNavigate();

	const handleClickNewQuiz = () => {
		navigate("/quiz-edit/new");
	};

	return (
		<>
			<LoadingLayout isLoading={isLoading} error={error}>
				<Box sx={{ width: "100%", height: "100%", padding: "10px 20px", display: "flex", flexDirection: "column", gap: "20px" }}>
					<Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
						<Text variant="h4">{t("quiz_list.title")}</Text>
						<DefaultButton sx={{ display: "flex", alignItems: "center", gap: "5px" }} onClick={handleClickNewQuiz}>
							<AddIcon />
							<Text sx={{ color: "#fff" }}>{t("quiz_list.add_button")}</Text>
						</DefaultButton>
					</Box>
					<QuizesList />
				</Box>
			</LoadingLayout>
		</>
	);
};
