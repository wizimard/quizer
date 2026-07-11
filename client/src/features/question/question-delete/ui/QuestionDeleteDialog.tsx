import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { AxiosError } from "axios";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@shared/ui/kit/dialog";
import { DefaultButton } from "@shared/ui/button";
import { Text } from "@shared/ui/text";
import { BaseDialog } from "@shared/ui/dialog";
import { questionApi } from "@shared/api";
import type { TestFull } from "@entities/test";
import type { Question } from "@entities/question";

export interface QuestionDeleteDialogProps {
	onDeleteSuccess(): void;
	isOpen: boolean;
	onOpenChange: (open?: boolean) => void;
	question: Question;
}

export const QuestionDeleteDialog = ({ onDeleteSuccess, question, isOpen, onOpenChange }: QuestionDeleteDialogProps) => {
	const { t } = useTranslation();

	const queryClient = useQueryClient();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const deleteQuestionMutation = useMutation({
		mutationFn: () => {
			return questionApi.questionTestIdQuestionsQuestionIdDelete(question.testId, question.id);
		},
		onSuccess: () => {
			queryClient.setQueryData(["test", question.testId], (test: TestFull) => {
				return {
					...test,
					questions: test.questions.filter((q) => q.id !== question.id),
				};
			});

			onOpenChange(false);

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

		onOpenChange(false);
	};

	const handleCancel = () => {
		onOpenChange(false);
	};

	return (
		<>
			<BaseDialog open={isOpen} onOpenChange={onOpenChange}>
				<DialogContent className="pb-5">
					<DialogHeader>
						<DialogTitle>{t("question_delete.dialog.title")}</DialogTitle>
					</DialogHeader>
					<DialogDescription>{t("question_delete.dialog.description")}</DialogDescription>
					{errorMessage && <Text color="error">{t(errorMessage)}</Text>}
					<DialogFooter className="w-full border-0 bg-transparent p-0 m-0">
						<DefaultButton variant="outline" onClick={handleCancel}>
							{t("common.button_cancel")}
						</DefaultButton>
						<DefaultButton variant="destructive" onClick={handleDelete} isLoading={deleteQuestionMutation.isPending}>
							{t("common.button_delete")}
						</DefaultButton>
					</DialogFooter>
				</DialogContent>
			</BaseDialog>
		</>
	);
};
