import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { AxiosError } from "axios";
import { useQuestionDelete } from "../store/question-delete";
import { api } from "@shared/api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@shared/ui/kit/dialog";
import { DefaultButton } from "@shared/ui/button";
import type { TQuiz } from "@entities/quiz";
import { Text } from "@shared/ui/text";
import type { QuestionResponse } from "@shared/api/generated";

export interface IQuestionDeleteDialogProps {
	onDeleteSuccess(): void;
}

export const QuestionDeleteDialog = ({ onDeleteSuccess }: IQuestionDeleteDialogProps) => {
	const { t } = useTranslation();

	const queryClient = useQueryClient();

	const isOpen: boolean = useQuestionDelete((state) => state.isOpen);
	const question: QuestionResponse | null = useQuestionDelete((state) => state.question);
	const clear = useQuestionDelete((state) => state.clear);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const deleteQuestionMutation = useMutation({
		mutationFn: () => {
			return api.questionQuizIdQuestionsQuestionIdDelete(question!.quizId, question!.id);
		},
		onSuccess: () => {
			queryClient.setQueryData(["quiz", question!.quizId], (quiz: TQuiz) => {
				return {
					...quiz,
					questions: quiz.questions.filter((q) => q.id !== question!.id),
				};
			});

			clear();
			onDeleteSuccess();
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

	const handleDelete = () => {
		setErrorMessage(null);

		deleteQuestionMutation.mutate();
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={clear}>
				<DialogContent className="pb-5">
					<DialogHeader>
						<DialogTitle>{t("question_delete.dialog.title")}</DialogTitle>
					</DialogHeader>
					<DialogDescription>{t("question_delete.dialog.description")}</DialogDescription>
					{errorMessage && <Text color="error">{t(errorMessage)}</Text>}
					<DialogFooter className="w-full border-0 bg-transparent p-0 m-0">
						<DefaultButton variant="outline" onClick={clear}>
							{t("common.button_cancel")}
						</DefaultButton>
						<DefaultButton variant="destructive" onClick={handleDelete} isLoading={deleteQuestionMutation.isPending}>
							{t("common.button_delete")}
						</DefaultButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};
