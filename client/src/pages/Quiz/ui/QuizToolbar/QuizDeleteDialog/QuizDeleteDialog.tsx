import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { api } from "@shared/api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export interface IQuizDeleteDialogProps {
	quizId: string;
	isOpen: boolean;
	handleClose(): void;
}

export const QuizDeleteDialog = ({ quizId, isOpen, handleClose }: IQuizDeleteDialogProps) => {
	const { t } = useTranslation();

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
			<DialogTitle>{t("quiz.delete_modal.title")}</DialogTitle>
			<DialogActions>
				<Button autoFocus onClick={handleClose}>
					{t("common.button_cancel")}
				</Button>
				<Button color="error" onClick={handleRemove} loading={isLoading}>
					{t("common.button_delete")}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
