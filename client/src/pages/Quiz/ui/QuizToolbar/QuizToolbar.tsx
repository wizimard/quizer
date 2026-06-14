import { Box, ButtonGroup } from "@mui/material";
import type { QuizResponse } from "@shared/api/generated";
import { ButtonWithIcon } from "@shared/ui/button";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { Text } from "@shared/ui/text";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { QuizDeleteDialog } from "./QuizDeleteDialog";

export interface IQuizToolbar {
	quiz: QuizResponse;
}

export const QuizToolbar = ({ quiz: { id, title } }: IQuizToolbar) => {
	const navigate = useNavigate();

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleClickEdit = () => {
		navigate(`/quiz-edit/${id}`);
	};

	const handleClickRemove = () => {
		setIsOpen(true);
	};

	const handleCloseDialog = () => {
		setIsOpen(false);
	};

	return (
		<>
			<Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
				<Text component="h1" sx={{ fontSize: "1.4rem" }}>
					Викторина: {title}
				</Text>
				<ButtonGroup>
					<ButtonWithIcon IconComponent={EditIcon} text="Изменить" onClick={handleClickEdit} />
					<ButtonWithIcon IconComponent={DeleteForeverIcon} text="Удалить" color="error" onClick={handleClickRemove} />
				</ButtonGroup>
			</Box>
			<QuizDeleteDialog quizId="id" handleClose={handleCloseDialog} isOpen={isOpen} />
		</>
	);
};
