import { DefaultButton } from "@shared/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@shared/ui/kit/dialog";
import { Text } from "@shared/ui/text";
import { useTranslation } from "react-i18next";
import { useDeleteQuiz } from "../../model/useDeleteQuiz";

export interface IQuizDeleteDialogProps {
	quizId: string;
	isOpen: boolean;
	handleClose(): void;
}

export const QuizDeleteDialog = ({ quizId, isOpen, handleClose }: IQuizDeleteDialogProps) => {
	const { t } = useTranslation();

	const quizDeleteMutation = useDeleteQuiz();

	const handleRemove = async () => {
		quizDeleteMutation.mutate(quizId);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent showCloseButton={false} className="h-[300px] flex flex-col items-center gap-2.5">
				<Text className="text-[150%]">{t("quiz.delete_modal.title")}</Text>
				<img src="/quiz_card_img.png" alt="quiz image" className="w-[150px] shrink-0" />
				<DialogFooter className="mt-5 w-full border-0 bg-transparent p-0">
					<DefaultButton variant="outline" onClick={handleClose}>
						{t("common.button_cancel")}
					</DefaultButton>
					<DefaultButton variant="destructive" onClick={handleRemove} isLoading={quizDeleteMutation.isPending}>
						{t("common.button_delete")}
					</DefaultButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
