import { useTranslation } from "react-i18next";
import { useState } from "react";
import { QuizCreateDialog } from "./QuizCreateDialog";
import { ButtonAdd } from "@shared/ui/button/ButtonAdd";

export const QuizCreateWidget = () => {
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);

	const handleClickNewQuiz = () => {
		setIsOpen(true);
	};

	const handleCloseDialog = () => {
		setIsOpen(false);
	};

	return (
		<>
			<ButtonAdd text={t("quiz_list.add_button")} onClick={handleClickNewQuiz} />
			<QuizCreateDialog isOpen={isOpen} handleClose={handleCloseDialog} />
		</>
	);
};
