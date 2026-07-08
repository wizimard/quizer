import { useTranslation } from "react-i18next";
import { QuizCreateForm } from "@features/quiz/quiz-create";
import { DialogContent, DialogHeader, DialogTitle } from "@shared/ui/kit/dialog";
import { BaseDialog } from "@shared/ui/dialog";

export interface IQuizCreateDialogProps {
	isOpen: boolean;
	handleClose(): void;
}

export const QuizCreateDialog = ({ isOpen, handleClose }: IQuizCreateDialogProps) => {
	const { t } = useTranslation();

	return (
		<BaseDialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="pb-5">
				<DialogHeader>
					<DialogTitle>{t("quiz_list.add_button")}</DialogTitle>
				</DialogHeader>
				<QuizCreateForm />
			</DialogContent>
		</BaseDialog>
	);
};
