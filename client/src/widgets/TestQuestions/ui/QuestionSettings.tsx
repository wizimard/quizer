import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQuestionDrawer } from "../store/question-drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@shared/ui/kit/sheet";
import { QuestionForm } from "@features/question/question-insert";
import { DefaultButton } from "@shared/ui/button";
import { QuestionDeleteDialog } from "@features/question/question-delete";
import type { Question } from "@entities/question";

export const QuestionSettings = () => {
	const { t } = useTranslation();

	const isOpenDrawer = useQuestionDrawer((state) => state.isOpen);
	const setIsOpenDrawer = useQuestionDrawer((state) => state.setIsOpen);

	const question: Question | undefined = useQuestionDrawer((state) => state.question);

	const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false);

	if (!question) {
		return null;
	}

	const handleClickDelete = () => {
		setIsOpenDeleteDialog(true);
	};

	const handleDeleteSuccess = () => {
		setIsOpenDrawer(false);
	};

	const handleCloseDeleteDialog = () => {
		setIsOpenDeleteDialog(false);
	};

	return (
		<>
			<Sheet open={isOpenDrawer} onOpenChange={setIsOpenDrawer}>
				<SheetContent side="right" className="scrollbar-styled w-[400px] gap-1 overflow-y-auto p-0 sm:max-w-[350px]">
					<SheetHeader className="px-5">
						<SheetTitle className="text-xl font-semibold tracking-tight">{t("question_settings.title")}</SheetTitle>
					</SheetHeader>
					<div className="px-5 pb-2 flex flex-col gap-4">
						<QuestionForm question={question} />
						<DefaultButton variant="destructive" onClick={handleClickDelete}>
							{t("question_delete.button")}
						</DefaultButton>
					</div>
				</SheetContent>
			</Sheet>
			<QuestionDeleteDialog onDeleteSuccess={handleDeleteSuccess} isOpen={isOpenDeleteDialog} onOpenChange={handleCloseDeleteDialog} question={question} />
		</>
	);
};
