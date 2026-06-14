import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogTitle } from "@mui/material";
import type { QuizResponse } from "@shared/api/generated";
import { ButtonWithIcon } from "@shared/ui/button";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { Text } from "@shared/ui/text";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@shared/api";

export interface IQuizToolbar {
	quiz: QuizResponse;
}

export const QuizToolbar = ({ quiz: { id, title } }: IQuizToolbar) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const navigate = useNavigate();

	const handleClickEdit = () => {
		navigate(`/quiz-edit/${id}`);
	};

	const handleClickRemove = () => {
		setIsOpen(true);
	};

	const handleCloseDialog = () => {
		setIsOpen(false);
	};

	const handleRemove = async () => {
		setIsLoading(true);

		try {
			await api.quizIdDelete(id);

			navigate("/");
		} catch (err) {
			console.error(err);
		}

		setIsLoading(false);
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
			<Dialog open={isOpen} onClose={handleCloseDialog}>
				<DialogTitle>Вы уверены, что хотите удалить викторину?</DialogTitle>
				<DialogActions>
					<Button autoFocus onClick={handleCloseDialog}>
						Отменить
					</Button>
					<Button color="error" onClick={handleRemove} loading={isLoading}>
						Удалить
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
