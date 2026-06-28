import { api } from "@shared/api";
import { DefaultButton } from "@shared/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@shared/ui/kit/dialog";
import { Text } from "@shared/ui/text";
import { useMutation } from "@tanstack/react-query";
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

	const quizDeleteMutation = useMutation({
		mutationFn: () => api.quizIdDelete(quizId),
		onSuccess: () => {
			navigate("/");
		},
		onError: (err) => {
			console.error(err);
		},
	});

	const handleRemove = async () => {
		quizDeleteMutation.mutate();
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
