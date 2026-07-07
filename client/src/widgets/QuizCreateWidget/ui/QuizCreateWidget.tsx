import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { QuizCreateDialog } from "./QuizCreateDialog";
import { ButtonWithIcon } from "@shared/ui/button";

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
			<ButtonWithIcon text={t("quiz_list.add_button")} Icon={Plus} onClick={handleClickNewQuiz} variant="outline" />
			<QuizCreateDialog isOpen={isOpen} handleClose={handleCloseDialog} />
		</>
	);
};
