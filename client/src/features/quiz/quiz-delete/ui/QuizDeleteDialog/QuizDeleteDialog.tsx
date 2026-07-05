import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AxiosError } from "axios";
import { api } from "@shared/api";
import { DefaultButton } from "@shared/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@shared/ui/kit/dialog";
import { Text } from "@shared/ui/text";

export interface IQuizDeleteDialogProps {
	quizId: string;
	isOpen: boolean;
	handleClose(): void;
}

export const QuizDeleteDialog = ({ quizId, isOpen, handleClose }: IQuizDeleteDialogProps) => {
	const { t } = useTranslation();

	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const quizDeleteMutation = useMutation({
		mutationFn: (quizId: string) => api.quizQuizIdDelete(quizId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["quizes"] });
			navigate("/");
		},
		onError: (error) => {
			if (!(error instanceof AxiosError) || !error.response?.data?.message) {
				console.error(error);
				setErrorMessage("errors.unknown_error");
				return;
			}
			setErrorMessage(error.response.data.message);
		},
	});

	const handleRemove = async () => {
		setErrorMessage(null);

		quizDeleteMutation.mutate(quizId);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent showCloseButton={false} className="h-[300px] flex flex-col items-center gap-2.5">
				<Text className="text-[150%]">{t("quiz.delete_modal.title")}</Text>
				<img src="/quiz_card_img.png" alt="quiz image" className="w-[150px] shrink-0" />

				{errorMessage && <Text color="error">{t(errorMessage)}</Text>}

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
