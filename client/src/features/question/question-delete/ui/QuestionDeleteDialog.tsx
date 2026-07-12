import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { AxiosError } from "axios";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@shared/ui/kit/dialog";
import { DefaultButton } from "@shared/ui/button";
import { Typography } from "@shared/ui/typography";
import { questionApi } from "@shared/api";
import type { TestFull } from "@entities/test";
import type { Question } from "@entities/question";
import { DIALOG_KEYS, DRAWER_KEYS, useCloseDrawer, useDialog } from "@shared/model";

export interface QuestionDeleteDialogProps {
	question: Question;
}
// TODO: review
export const QuestionDeleteDialog = ({ question }: QuestionDeleteDialogProps) => {
	const { t } = useTranslation();

	const queryClient = useQueryClient();

	const { isOpen, lockDialog, unlockDialog, closeDialog } = useDialog(DIALOG_KEYS.QUESTION_DELETE);
	const closeDrawer = useCloseDrawer(DRAWER_KEYS.QUESTION_SETTINGS);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const deleteQuestionMutation = useMutation({
		mutationFn: () => {
			lockDialog();
			return questionApi.questionTestIdQuestionsQuestionIdDelete(question.testId, question.id);
		},
		onSuccess: () => {
			queryClient.setQueryData(["test", question.testId], (test: TestFull) => {
				return {
					...test,
					questions: test.questions.filter((q) => q.id !== question.id),
				};
			});

			closeDialog();

			closeDrawer();
		},
		onError: (error) => {
			if (!(error instanceof AxiosError) || !error.response?.data?.message) {
				console.error(error);
				setErrorMessage("errors.unknown_error");
				return;
			}

			setErrorMessage(error.response.data.message);
		},
		onSettled: () => {
			unlockDialog();
		},
	});

	const handleDelete = () => {
		setErrorMessage(null);

		deleteQuestionMutation.mutate();
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={closeDialog}>
				<DialogContent className="pb-5">
					<DialogHeader>
						<DialogTitle>{t("question_delete.dialog.title")}</DialogTitle>
					</DialogHeader>
					<DialogDescription>{t("question_delete.dialog.description")}</DialogDescription>
					{errorMessage && <Typography color="error">{t(errorMessage)}</Typography>}
					<DialogFooter className="w-full border-0 bg-transparent p-0 m-0">
						<DefaultButton variant="outline" onClick={closeDialog}>
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
