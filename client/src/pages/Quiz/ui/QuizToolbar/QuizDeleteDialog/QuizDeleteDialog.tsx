import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { api } from "@shared/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface IQuizDeleteDialogProps {
	quizId: string;
	isOpen: boolean;
	handleClose(): void;
}

export const QuizDeleteDialog = ({ quizId, isOpen, handleClose }: IQuizDeleteDialogProps) => {
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleRemove = async () => {
		setIsLoading(true);

		try {
			await api.quizIdDelete(quizId);

			navigate("/");
		} catch (err) {
			console.error(err);
		}

		setIsLoading(false);
	};

	return (
		<Dialog open={isOpen} onClose={handleClose}>
			<DialogTitle>Вы уверены, что хотите удалить викторину?</DialogTitle>
			<DialogActions>
				<Button autoFocus onClick={handleClose}>
					Отменить
				</Button>
				<Button color="error" onClick={handleRemove} loading={isLoading}>
					Удалить
				</Button>
			</DialogActions>
		</Dialog>
	);
};
